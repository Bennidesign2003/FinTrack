import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db'
import { suppliers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, phone, address, city, postalCode, country, taxId, notes } = req.body

      if (!name) {
        return res.status(400).json({ error: 'Name ist erforderlich' })
      }

      const result = await db
        .insert(suppliers)
        .values({
          name,
          email: email || null,
          phone: phone || null,
          address: address || null,
          city: city || null,
          postalCode: postalCode || null,
          country: country || null,
          taxId: taxId || null,
          notes: notes || null
        })
        .run()

      const insertedId = Number(result.lastInsertRowid || result.lastInsertRowid)
      if (!Number.isFinite(insertedId)) {
        return res.status(201).json({
          name,
          email,
          phone,
          address,
          city,
          postalCode,
          country,
          taxId,
          notes
        })
      }

      const created = await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.id, insertedId))
        .get()

      return res.status(201).json(created)
    } catch (error: any) {
      console.error('Error creating supplier:', error)
      if (error.message?.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Ein Lieferant mit diesem Namen existiert bereits' })
      }
      return res.status(500).json({ error: 'Fehler beim Erstellen des Lieferanten', details: String(error) })
    }
  } else if (req.method === 'GET') {
    try {
      const allSuppliers = await db.select().from(suppliers).all()
      return res.status(200).json(allSuppliers)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      return res.status(500).json({ error: 'Fehler beim Abrufen der Lieferanten', details: String(error) })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name, email, phone, address, city, postalCode, country, taxId, notes } = req.body

      if (!id) {
        return res.status(400).json({ error: 'ID ist erforderlich' })
      }

      await db
        .update(suppliers)
        .set({
          name,
          email: email || null,
          phone: phone || null,
          address: address || null,
          city: city || null,
          postalCode: postalCode || null,
          country: country || null,
          taxId: taxId || null,
          notes: notes || null,
          updatedAt: new Date().toISOString()
        })
        .where(eq(suppliers.id, id))
        .run()

      const updated = await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.id, id))
        .get()

      return res.status(200).json(updated)
    } catch (error: any) {
      console.error('Error updating supplier:', error)
      if (error.message?.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Ein Lieferant mit diesem Namen existiert bereits' })
      }
      return res.status(500).json({ error: 'Fehler beim Aktualisieren des Lieferanten', details: String(error) })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id) {
        return res.status(400).json({ error: 'ID ist erforderlich' })
      }

      await db.delete(suppliers).where(eq(suppliers.id, Number(id))).run()

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error deleting supplier:', error)
      return res.status(500).json({ error: 'Fehler beim Löschen des Lieferanten', details: String(error) })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
