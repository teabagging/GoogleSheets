---
title: Cloud Platforms
pagination_prev: demos/local/index
pagination_next: demos/extensions/index
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

Cloud platforms can provide remote storage, compute, and other infrastructure.
SheetJS libraries are written in pure JavaScript and are readily integrated in
cloud platforms.  Some platform-specific configuration may be required.

## Platform as a Service

Cloud PaaS typically offer extensibility through client-side scripts or special
code that is run in NodeJS or RhinoJS or other engines:

- [Salesforce Lightning Web Components](/docs/demos/cloud/salesforce)
- [NetSuite](/docs/demos/cloud/netsuite)

## Cloud Compute

Cloud computing is commonly offered as "serverless" functions, small snippets
of code that are run in NodeJS or other server-side JS platforms. While SheetJS
libraries can run in server-side environments, the cloud platforms can corrupt
form data.  This can be disabled with cloud-specific configuration:

- [AWS Lambda Functions](/docs/demos/cloud/aws#lambda-functions)
- [Azure Functions](/docs/demos/cloud/azure#azure-functions)
- [GitHub Actions](/docs/demos/cloud/github)
- [Deno Deploy](/docs/demos/cloud/deno)

## Cloud Storage

The primary pitfall with cloud storage is binary data mangling. Spreadsheet
files typically contain binary characters.  Cloud storage APIs can corrupt
binary data, so special care must be taken.

- [Amazon Simple Storage Service (S3)](/docs/demos/cloud/aws#s3-storage)
- [Azure Blob Storage](/docs/demos/cloud/azure#blob-storage)

### File Hosting

File hosting services provide simple solutions for storing data, synchronizing
files across devices, and sharing with specific users or customers. Demos:

- [Dropbox](/docs/demos/cloud/dropbox)

## Cloud Data

Cloud Data Platforms are popular storage media for structured data, typically
offering APIs for programmatic data ingress and egress.  Demos:

- [Google Sheets](/docs/demos/cloud/gsheet)
- [Airtable](/docs/demos/cloud/airtable)
