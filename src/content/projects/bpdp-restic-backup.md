---
title: 'Centralized Restic Backup & SYSmon Reporting'
summary: 'Centralized, monitorable backup workflows for application files and databases, with scheduled snapshots, restore validation, and daily status reporting.'
category: professional
role: 'DevOps & Infrastructure Engineer'
dateStart: 2026-01-01
displayDate: '2026'
technologies: ['Restic', 'MySQL', 'SSH', 'rsync', 'Bash', 'Cron']
featured: true
draft: false
seoDescription: 'Centralized Restic backup and SYSmon reporting workflows for BPDP application files and MySQL databases.'
---

## Overview

Implemented and validated backup and recovery workflows for application files and MySQL databases, including scheduled snapshots, retention policies, restore testing, and recovery documentation.

## Approach

Automated database dumps and application-file synchronization from target servers to centralized staging with SSH, rsync, shell scripts, and scheduled cron jobs. Restic snapshots use dataset tags and structured status, diff, size, and duration output.

## Operations

A multi-source SYSmon monitoring view supports daily operational checks, while restore testing verifies that recovery procedures remain usable.
