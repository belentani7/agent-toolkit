"""notebook-lite — Chat with your documents in the terminal."""

from setuptools import setup, find_packages
from pathlib import Path

long_description = ""
readme = Path(__file__).parent / "README.md"
if readme.exists():
    long_description = readme.read_text(encoding="utf-8")

setup(
    name="notebook-lite",
    version="0.1.0",
    description="A personal research assistant — chat with your documents in the terminal",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Pedro Belentani",
    author_email="pedro@belentani.dev",
    url="https://github.com/belentani7/notebook-lite",
    license="MIT",
    packages=find_packages(),
    py_modules=["engine", "display", "extractors"],
    include_package_data=True,
    package_data={
        "": ["database/*.sql", "config/*.yaml", "ascii/*.txt", "web/*.svg"],
    },
    python_requires=">=3.7",
    install_requires=[
        "sentence-transformers>=2.2.0",
        "PyPDF2>=3.0.0",
        "requests>=2.28.0",
    ],
    extras_require={
        "full": [
            "sqlite-vec>=0.1.0",
            "pdfplumber>=0.9.0",
            "PyYAML>=6.0",
        ],
        "ocr": [
            "pytesseract>=0.3.10",
            "Pillow>=9.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "notebook-lite=notebook_lite:main",
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "Intended Audience :: Education",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Text Processing :: Indexing",
        "Environment :: Console",
    ],
    keywords="notebook chat documents embeddings rag terminal offline privacy",
)
