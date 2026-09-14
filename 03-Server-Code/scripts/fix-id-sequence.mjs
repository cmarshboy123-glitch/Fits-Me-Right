// One-time fixup for the Product.id autoincrement migration.
//
// `prisma db push` adds the sequence and points the column's default at it,
// but a fresh sequence always starts at 1 — it has no way to know this table
// already has rows with manually-assigned ids going well past that. Without
// this step, the very next insert would try id=1 and collide with the
// existing row that already has it. This syncs the sequence's current value
// to the table's actual max id, so the next insert continues safely upward.
//
// Safe to run more than once — setval() is idempotent for this purpose.
import { prisma } from '../src/lib/prisma.js'

const [{ setval }] = await prisma.$queryRaw`
  SELECT setval(pg_get_serial_sequence('"Product"', 'id'), (SELECT MAX(id) FROM "Product")) AS setval
`

console.log(`Product id sequence synced to ${setval}.`)
await prisma.$disconnect()
