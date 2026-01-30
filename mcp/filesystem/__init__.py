# Filesystem MCP


def read_file(path):
    """Read and return the contents of the file at the given path."""
    with open(path, "r") as f:
        return f.read()


def write_file(path, content):
    """Write the given content to the file at the specified path."""
    with open(path, "w") as f:
        f.write(content)
