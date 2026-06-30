'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { resetDemoData, seedDemoData } from '@/lib/seed-demo'

/** Loads (or reloads) the Daniel demo dataset, then opens the dashboard. */
export async function loadDemoDataAction() {
  await seedDemoData(db)
  revalidatePath('/dashboard')
  revalidatePath('/wrapped')
  revalidatePath('/check-in')
  redirect('/dashboard')
}

/** Clears the Daniel demo dataset from Aurora. */
export async function resetDemoDataAction() {
  await resetDemoData(db)
  revalidatePath('/dashboard')
  revalidatePath('/wrapped')
  revalidatePath('/check-in')
  revalidatePath('/demo')
}
