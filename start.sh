#!/bin/bash

bunx prisma migrate dev --name init

bun run start