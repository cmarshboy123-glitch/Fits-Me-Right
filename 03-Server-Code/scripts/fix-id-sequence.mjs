// One-time fixup for the Product.id autoincrement migration.
//
// `prisma db push` should add a sequence and point the column's default at
// it, but a fresh sequence always starts at 1 regardless of what's already
// in the table — so without a sync step, the very next insert would try
// id=1 and collide with the row that already has it.
//
// This script is self-contained and safe to run repeatedly: it verifies (and
// creates, if somehow still missing) the sequence and column default itself
// rather than assuming `db push` already did it, then syncs the sequence's
// current value to the table's actual max id, then prints every relevant
// piece of state so a bad result is diagnosable from the output alone.
import { prisma } from '../src/lib/prisma.js'

const before = await prisma.$queryRaw`
  SELECT column_default FROM information_schema.columns
  WHERE table_name = 'Product' AND column_name = 'id'
`
console.log('id column default (before):', JSON.stringify(before))

const maxRow = await prisma.$queryRaw`SELECT COALESCE(MAX(id), 0) AS max FROM "Product"`
const maxId = Number(maxRow[0].max)
console.log('current max(id):', maxId)

let [{ seq }] = await prisma.$queryRaw`SELECT pg_get_serial_sequence('"Product"', 'id') AS seq`
console.log('resolved sequence name:', seq)

if (!seq) {
  console.log('No sequence found — creating one and wiring it up as the column default.')
  await prisma.$executeRawUnsafe(`CREATE SEQUENCE "Product_id_seq" OWNED BY "Product"."id"`)
  await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ALTER COLUMN "id" SET DEFAULT nextval('"Product_id_seq"')`)
  ;[{ seq }] = await prisma.$queryRaw`SELECT pg_get_serial_sequence('"Product"', 'id') AS seq`
  console.log('resolved sequence name (after create):', seq)
}

const [{ setval }] = await prisma.$queryRawUnsafe(
  `SELECT setval($1, $2) AS setval`,
  seq,
  maxId,
)
console.log('synced sequence current value to:', setval)

const [seqState] = await prisma.$queryRawUnsafe(`SELECT last_value, is_called FROM ${seq}`)
console.log('sequence state after sync:', seqState)

const after = await prisma.$queryRaw`
  SELECT column_default FROM information_schema.columns
  WHERE table_name = 'Product' AND column_name = 'id'
`
console.log('id column default (after):', JSON.stringify(after))

await prisma.$disconnect()
