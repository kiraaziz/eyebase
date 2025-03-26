import { useAcceptInvitaion } from '@/hooks/usePermission'
import { redirect } from 'next/navigation'

  
export const metadata = {
  title: 'Eyebase | Join',
}
 
export default async function page({ params }: any) {

  await useAcceptInvitaion(params.id)

  return redirect(`/${params.id}`)
}
