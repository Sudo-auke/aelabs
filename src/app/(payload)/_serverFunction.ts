'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from './admin/importMap'

type ServerFunctionClient = Parameters<typeof handleServerFunctions>[0]

export const serverFunction = async (args: ServerFunctionClient) => {
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}
