---
completion: 0%
---

# Narradin

Narradin is an Obsidian plugin that helps manage long-form writing in an Obsidian native manner. It has been designed with certain [[Principles]] in mind.

This documentation describes the components and behaviors expected from the Narradin plugin in a declarative form. Start here, and work your way through all defined terms, ideally following the links.

Terms like vault, note, tag, and alias are used as defined in [Obsidian's glossary](https://obsidian.md/help/glossary). Context will dictate the interpretation when synonyms might clash with Obsidian vocabulary, e.g. theme refering to the narrative instead of [Obsidian's theme](https://obsidian.md/help/glossary#theme).

The markdown syntax used in these documents follows [Foam's conventions](https://docs.foam.md/).

Narradin considers any note that has a [[settings/properties#Role property]] set to a valid Narradin [[Roles#Role]] to be a note that it can operate on. All these notes together make up Narradin's scope.

## Operating System

Narradin is only fully tested, locally, against macOS. Non-Obsidian dependent internals may be tested against a Linux version in github workflows. While not supporting other operating systems, Narradin does try to avoid leaning on macOS specific features.

## Obsidian

Narradin is a desktop-only plugin that works for Obsidian version 1.13 and above.

## Third-party Obsidian plugins

Narradin uses third-party plugins primarily for UI integrations. It leverages the Obsidian eco-system where it offers value. This reliance makes Narradin more brittle and thus a rationale must be provided to warrant such dependencies.

Equally there should a be a short rationale as to why functionality was built into Narradin, where a plugin with matchign functionality was ignored.

[[Obsidian plugins]] that score less than Good on their Health or less than Satisfactory on their Review need specific rationale to be used by Narradin and no rationale to be excluded.
