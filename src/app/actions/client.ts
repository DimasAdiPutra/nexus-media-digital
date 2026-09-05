'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export interface ClientInput {
	name: string
	email: string
	companyName: string
	phone?: string
	address?: string
}

/**
 * Retrieves all registered clients from the database ordered by creation date.
 */
export async function getClients() {
	try {
		const clients = await prisma.client.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		})
		return { success: true, data: clients }
	} catch (error) {
		console.error('Failed to fetch clients:', error)
		return { success: false, error: 'Failed to fetch client list.' }
	}
}

/**
 * Creates a new client record in the database.
 */
export async function createClient(data: ClientInput) {
	try {
		const client = await prisma.client.create({
			data: {
				name: data.name,
				email: data.email,
				companyName: data.companyName,
				phone: data.phone || null,
				address: data.address || null,
			},
		})

		revalidatePath('/clients')
		return { success: true, data: client }
	} catch (error) {
		console.error('Failed to create client:', error)
		return { success: false, error: 'Failed to create new client.' }
	}
}

/**
 * Updates an existing client record by ID.
 */
export async function updateClient(id: string, data: Partial<ClientInput>) {
	try {
		const client = await prisma.client.update({
			where: { id },
			data: {
				...data,
			},
		})

		revalidatePath('/clients')
		return { success: true, data: client }
	} catch (error) {
		console.error('Failed to update client:', error)
		return { success: false, error: 'Failed to update client details.' }
	}
}

/**
 * Deletes a client record from the database by ID.
 */
export async function deleteClient(id: string) {
	try {
		await prisma.client.delete({
			where: { id },
		})

		revalidatePath('/clients')
		return { success: true }
	} catch (error) {
		console.error('Failed to delete client:', error)
		return { success: false, error: 'Failed to delete client.' }
	}
}
