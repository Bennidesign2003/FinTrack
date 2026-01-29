import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db'
import { customers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, phone, address, city, postalCode, country, taxId, notes } = req.body

      if (!name) {
        return res.status(400).json({ error: 'Name ist erforderlich' })
      }

      await db
        .insert(customers)
        .values({
          name,
          email: email || null,
          phone: phone || null,
          address: address || null,
          city: city || null,
          postalCode: postalCode || null,
          country: country || 'DE',
          taxId: taxId || null,
          notes: notes || null
        })
        .run()

      // fetch the created customer by name
      const created = await db.select().from(customers).where(eq(customers.name, name)).all()

      return res.status(201).json(created[0] || { name })
    } catch (error: any) {
      console.error('Error creating customer:', error)
      if (error.message?.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Kundenname bereits vorhanden' })
      }
      return res.status(500).json({ error: 'Fehler beim Erstellen des Kunden', details: String(error) })
    }
  } else if (req.method === 'GET') {
    try {
      const allCustomers = await db.select().from(customers).all()
      return res.status(200).json(allCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
      return res.status(500).json({ error: 'Fehler beim Abrufen der Kunden', details: String(error) })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name, email, phone, address, city, postalCode, country, taxId, notes } = req.body

      if (!id) {
        return res.status(400).json({ error: 'ID ist erforderlich' })
      }

      if (!name) {
        return res.status(400).json({ error: 'Name ist erforderlich' })
      }

      await db
        .update(customers)
        .set({
          name,
          email: email || null,
          phone: phone || null,
          address: address || null,
          city: city || null,
          postalCode: postalCode || null,
          country: country || 'DE',
          taxId: taxId || null,
          notes: notes || null,
          updatedAt: new Date().toISOString()
        })
        .where(eq(customers.id, Number(id)))
        .run()

      const updated = await db.select().from(customers).where(eq(customers.id, Number(id))).all()

      return res.status(200).json(updated[0])
    } catch (error: any) {
      console.error('Error updating customer:', error)
      if (error.message?.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Kundenname bereits vorhanden' })
      }
      return res.status(500).json({ error: 'Fehler beim Aktualisieren des Kunden', details: String(error) })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'Ungültige ID' })
      }

      await db.delete(customers).where(eq(customers.id, Number(id))).run()

      return res.status(200).json({ message: 'Kunde gelöscht' })
    } catch (error) {
      console.error('Error deleting customer:', error)
      return res.status(500).json({ error: 'Fehler beim Löschen des Kunden', details: String(error) })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
