#!/usr/bin/env python3
"""
Helix CLI entry point

Provides commands for interacting with the Helix coding agent. This is a placeholder script illustrating the intended interface.
"""

import sys


def main():
    if len(sys.argv) < 2:
        print("Usage: hx <command> [args...]")
        sys.exit(1)

    command = sys.argv[1]
    if command == "agent":
        print("Launching Helix agent (placeholder)")
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
