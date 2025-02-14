import { unstable_cache, revalidateTag } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Config } from 'src/payload-types'

type Global = keyof Config['globals']

const config = await configPromise
config.globals = config.globals?.map((global) => ({
  ...global,
  hooks: {
    ...global.hooks,
    afterChange: [
      async () => {
        'use server'
        await revalidateTag(`global_${global.slug}`)
      },
      ...(global.hooks?.afterChange || []),
    ],
  },
}))

async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
