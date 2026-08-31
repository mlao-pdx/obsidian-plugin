---
completion: 0%
---

# Folder note

A note is a folder note if its base name (fully qualified file name less path less extension) matches the folder note name set by the user in Narradin's settings.

It takes the form of any non-empty, literal text that is a valid base name for a file, where every occurrence of the optional `{{folder}}` is replaced by the note's parent folder's base name. E.g. for a pattern `_{{folder}}_index` the note `test/_test_index.md` would be a folder note, but `test/test.md` would not.

Narradin does not keep a folder note and its folder in sync. The user can rename one or the other to mismatch, at which point the note fails to be a folder note. The rationale is that if Narradin keeps it in sync, the user could never undo the folder note association. A separate command for disassociating folder from note was considered and dismissed as it felt more natural for the user to see the association fall aprt, then to be confused by why they cannot break the association by renaming ([[Principles#Idiomatic whenever possible]]/[[Principles#Vault is truth]]).

The user can align Narradin's folder note naming the folder note configuration of [[Third-party plugins#Notebook Navigator (NN)|NN]] to smoothen the integration between the two plugins.
