import { RequestGetItemsDto } from '../dtos/global.dto'
import {
  RequestGetItemsPrismaQueryDto,
  RequestGetItemsWithDefaultValuesDto,
} from '../dtos/prisma.dto'

export const prismaQueryTransformation = (
  query: RequestGetItemsDto,
): {
  prismaQuery: RequestGetItemsPrismaQueryDto
  pages: RequestGetItemsWithDefaultValuesDto
} => {
  const take = query.pagination ?? 10
  const skip = take * ((query.currentPage ?? 1) - 1)

  return {
    prismaQuery: {
      take,
      skip,
    },
    pages: {
      pagination: take,
      currentPage: query.currentPage ?? 1,
    },
  }
}
