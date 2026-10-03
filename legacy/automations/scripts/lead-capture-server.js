#!/usr/bin/env node
/**
 * lead-capture-server.js — Servidor de captación de leads multi-nicho
 *
 * API REST que recibe leads de todas las landing pages y los almacena
 * en una base de datos local + notifica por email.
 *
 * Uso:
 *   node lead-capture-server.js
 *   pm2 start lead-capture-server.js --name leads
 *
 * Endpoints:
 *   POST /api/leads          — Capturar nuevo lead
 *   GET  /api/leads          — Listar leads (auth required)
 *   GET  /api/leads/stats    — Estadísticas por nicho
 *   POST /api/leads/export   — Exportar CSV
 *   GET  /api/health         — Health check
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Config
const PORT = process.env.LEAD_PORT || 3847;
const DB_PATH = path.join(__dirname, '..', 'data', 'leads.json');
const LOG_PATH = path.join(__dirname, '..', 'logs', `leads-${new Date().toISOString().split('T')[0]}.log`);
const API_KEY = process.env.LEAD_API_KEY || 'belentani7-leads-key';

// Ensure directories
[path.dirname(DB_PATH), path.dirname(LOG_PATH)].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Database
function loadDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch {
        return { leads: [], created: new Date().toISOString() };
    }
}

function saveDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function log(msg) {
    const entry = `[${new Date().toISOString()}] ${msg}`;
    console.log(entry);
    fs.appendFileSync(LOG_PATH, entry + '\n');
}

// CORS headers
function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Validate lead
function validateLead(data) {
    const errors = [];
    if (!data.email || !data.email.includes('@')) errors.push('Email inválido');
    if (!data.niche) errors.push('Nicho requerido');
    if (!data.source) errors.push('Source requerido');
    return errors;
}

// Niches config
const NICHES = {
    reformas: { name: 'Steven Renovation', tag: 'reformas' },
    moda: { name: 'Arte Que Veste', tag: 'moda' },
    organizacion: { name: 'Biblioteca Infinita', tag: 'organizacion' },
    migracion: { name: 'Cruzando el Charco', tag: 'migracion' },
    duck: { name: 'DUCK Studio', tag: 'duck' },
    tech: { name: 'Noiacore / AI Tools', tag: 'tech' }
};

// Request handler
const server = http.createServer(async (req, res) => {
    setCORS(res);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;

    // Parse body for POST
    let body = '';
    if (req.method === 'POST') {
        body = await new Promise((resolve) => {
            let data = '';
            req.on('data', chunk => data += chunk);
            req.on('end', () => resolve(data));
        });
    }

    try {
        // === HEALTH CHECK ===
        if (pathname === '/api/health') {
            const db = loadDB();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                status: 'ok',
                uptime: process.uptime(),
                leads_total: db.leads.length,
                niches: Object.keys(NICHES),
                timestamp: new Date().toISOString()
            }));
        }

        // === CAPTURE LEAD ===
        if (pathname === '/api/leads' && req.method === 'POST') {
            let data;
            try {
                data = JSON.parse(body);
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'JSON inválido' }));
            }

            const errors = validateLead(data);
            if (errors.length > 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ errors }));
            }

            const db = loadDB();

            // Check duplicate
            const exists = db.leads.find(l => l.email === data.email && l.niche === data.niche);
            if (exists) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Lead ya existe para este nicho' }));
            }

            const lead = {
                id: crypto.randomUUID(),
                email: data.email.toLowerCase().trim(),
                name: data.name || '',
                niche: data.niche,
                source: data.source,
                tags: data.tags || [],
                metadata: data.metadata || {},
                status: 'new',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            db.leads.push(lead);
            saveDB(db);

            log(`📥 NEW LEAD: ${lead.email} | Niche: ${lead.niche} | Source: ${lead.source}`);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, lead_id: lead.id }));
        }

        // === LIST LEADS (requires API key) ===
        if (pathname === '/api/leads' && req.method === 'GET') {
            const authHeader = req.headers.authorization;
            if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Unauthorized' }));
            }

            const db = loadDB();
            const niche = url.searchParams.get('niche');
            const status = url.searchParams.get('status');
            let leads = db.leads;

            if (niche) leads = leads.filter(l => l.niche === niche);
            if (status) leads = leads.filter(l => l.status === status);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ total: leads.length, leads }));
        }

        // === STATS ===
        if (pathname === '/api/leads/stats') {
            const authHeader = req.headers.authorization;
            if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Unauthorized' }));
            }

            const db = loadDB();
            const stats = {};
            for (const [key, config] of Object.entries(NICHES)) {
                const nicheLeads = db.leads.filter(l => l.niche === key);
                stats[key] = {
                    name: config.name,
                    total: nicheLeads.length,
                    new: nicheLeads.filter(l => l.status === 'new').length,
                    contacted: nicheLeads.filter(l => l.status === 'contacted').length,
                    converted: nicheLeads.filter(l => l.status === 'converted').length,
                    last_lead: nicheLeads.length > 0 ? nicheLeads[nicheLeads.length - 1].created_at : null
                };
            }

            const today = new Date().toISOString().split('T')[0];
            const todayLeads = db.leads.filter(l => l.created_at.startsWith(today));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                total_leads: db.leads.length,
                today: todayLeads.length,
                by_niche: stats,
                generated_at: new Date().toISOString()
            }));
        }

        // === EXPORT CSV ===
        if (pathname === '/api/leads/export' && req.method === 'POST') {
            const authHeader = req.headers.authorization;
            if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Unauthorized' }));
            }

            const db = loadDB();
            const csv = ['id,email,name,niche,source,status,created_at'];
            db.leads.forEach(l => {
                csv.push(`${l.id},${l.email},${l.name},${l.niche},${l.source},${l.status},${l.created_at}`);
            });

            res.writeHead(200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`
            });
            return res.end(csv.join('\n'));
        }

        // 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));

    } catch (err) {
        log(`❌ ERROR: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
});

server.listen(PORT, () => {
    log(`🚀 Lead Capture Server running on http://localhost:${PORT}`);
    log(`📋 Niches: ${Object.keys(NICHES).join(', ')}`);
    log(`🔑 API Key: ${API_KEY.substring(0, 8)}...`);
});
