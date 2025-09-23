import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { PrismaService } from 'src/utility-modules/prisma/prisma.service'

@Injectable()
export class DefaultService {
  constructor(private readonly prisma: PrismaService) {}

  async health() {
    let dbOk = false
    let migrationVersion: string | null = null

    try {
      // Simple DB check
      await this.prisma.$queryRaw`SELECT 1`
      dbOk = true

      // Get last applied migration
      const result: any = await this.prisma.$queryRawUnsafe(
        `SELECT migration_name FROM "_prisma_migrations" ORDER BY finished_at DESC LIMIT 1;`,
      )
      if (Array.isArray(result) && result.length > 0) {
        migrationVersion = result[0].migration_name
      }
    } catch (e) {
      dbOk = false
    }

    // Get app version from package.json
    let appVersion = 'unknown'
    try {
      const pkgPath = path.resolve(process.cwd(), 'package.json')
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      appVersion = pkg.version || 'unknown'
    } catch (e) {
      // ignore errors
    }

    return {
      live: true,
      database: dbOk,
      migrationVersion,
      appVersion,
    }
  }
}
