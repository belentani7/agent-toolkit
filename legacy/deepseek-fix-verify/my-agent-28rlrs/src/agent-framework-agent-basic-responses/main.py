# Copyright (c) Microsoft. All rights reserved.

import os
from contextlib import asynccontextmanager

from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from agent_framework_foundry_hosting import ResponsesHostServer
from azure.identity import DefaultAzureCredential
from azure.monitor.opentelemetry import configure_azure_monitor
from dotenv import load_dotenv
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.aiohttp_client import AioHttpClientInstrumentor
from opentelemetry.instrumentation.openai import OpenAIInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter

# Load environment variables from .env file
load_dotenv()


def setup_tracing():
    """Configure OpenTelemetry tracing for the agent."""
    # Check if Azure Monitor connection string is available
    connection_string = os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING")
    otel_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
    
    # Set up tracer provider
    provider = TracerProvider()
    trace.set_tracer_provider(provider)
    
    # Add console exporter for local development
    if os.getenv("OTEL_CONSOLE_EXPORT", "true").lower() == "true":
        provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
    
    # Add OTLP exporter if endpoint is configured
    if otel_endpoint:
        otlp_exporter = OTLPSpanExporter(endpoint=otel_endpoint)
        provider.add_span_processor(BatchSpanProcessor(otlp_exporter))
    
    # Configure Azure Monitor if connection string is available
    if connection_string:
        configure_azure_monitor(connection_string=connection_string)
    
    # Instrument common libraries
    OpenAIInstrumentor().instrument()
    AioHttpClientInstrumentor().instrument()
    
    return trace.get_tracer(__name__)


# Initialize tracer
tracer = setup_tracing()


@asynccontextmanager
async def lifespan(server):
    """Lifespan handler for the server with tracing."""
    tracer = trace.get_tracer(__name__)
    with tracer.start_as_current_span("agent-lifespan-startup") as span:
        span.set_attribute("agent.name", "basic-responses-agent")
        span.set_attribute("agent.version", "1.0.0")
        yield
    with tracer.start_as_current_span("agent-lifespan-shutdown"):
        pass


def main():
    model_name = os.getenv("AZURE_AI_MODEL_DEPLOYMENT_NAME") or os.getenv("FOUNDRY_MODEL_NAME")
    if not model_name:
        raise RuntimeError(
            "Model deployment name is not configured. Set "
            "AZURE_AI_MODEL_DEPLOYMENT_NAME or FOUNDRY_MODEL_NAME."
        )

    client = FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=model_name,
        credential=DefaultAzureCredential(),
    )

    agent = Agent(
        client=client,
        instructions="You are a friendly assistant. Keep your answers brief.",
        # History will be managed by the hosting infrastructure, thus there
        # is no need to store history by the service. Learn more at:
        # https://developers.openai.com/api/reference/resources/responses/methods/create
        default_options={"store": False},
    )

    server = ResponsesHostServer(agent, lifespan=lifespan)
    server.run()


if __name__ == "__main__":
    main()
