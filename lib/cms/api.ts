import { BOOKING_API, BookingApiError } from '@/lib/booking/api'
import { session } from '@/lib/cms/session'
import type * as T from '@/lib/cms/types'

async function request<R>(path: string, init: { method?: string; body?: unknown } = {}): Promise<R> {
  const token = session.get()
  let res: Response
  try {
    res = await fetch(`${BOOKING_API}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    })
  } catch {
    throw new BookingApiError(0, 'NETWORK', 'Can’t reach the booking service. Check the connection and try again.')
  }
  if (res.status === 204) return undefined as R
  const json = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401 && token) session.clear()
    const e = json?.error
    throw new BookingApiError(res.status, e?.code ?? 'HTTP_ERROR', e?.message ?? 'Something went wrong.', e?.details?.fields ?? {})
  }
  return json as R
}

const qs = (params: Record<string, string | number | undefined>) => {
  const s = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)]),
  )
  return s.size ? `?${s}` : ''
}

const data = <R,>(p: Promise<{ data: R }>) => p.then((r) => r.data)

export const cms = {
  login: (email: string, password: string) =>
    request<{ data: { token: string; expiresAt: string; user: T.User } }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  me: () => data(request<{ data: T.User }>('/auth/me')),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>('/auth/password', { method: 'POST', body: { currentPassword, newPassword } }),

  summary: () => data(request<{ data: T.Summary }>('/admin/summary')),
  appointments: (f: { status?: string; from?: string; to?: string; q?: string; page?: number; perPage?: number } = {}) =>
    request<T.Paged<T.StaffAppointment>>(`/admin/appointments${qs(f)}`),
  appointment: (id: number) => data(request<{ data: T.StaffAppointment }>(`/admin/appointments/${id}`)),
  act: (id: number, action: T.AppointmentAction, body: Record<string, unknown> = {}) =>
    data(request<{ data: T.StaffAppointment }>(`/admin/appointments/${id}/${action}`, { method: 'POST', body })),
  createAppointment: (body: Record<string, unknown>) => request<{ data: unknown }>('/admin/appointments', { method: 'POST', body }),

  services: () => data(request<{ data: T.AdminService[] }>('/admin/services')),
  createService: (body: T.ServiceInput) =>
    data(request<{ data: T.AdminService }>('/admin/services', { method: 'POST', body })),
  updateService: (id: number, body: T.ServiceInput) =>
    data(request<{ data: T.AdminService }>(`/admin/services/${id}`, { method: 'PATCH', body })),
  deleteService: (id: number) => request<void>(`/admin/services/${id}`, { method: 'DELETE' }),

  practitioner: (id: number) => data(request<{ data: T.AdminPractitioner }>(`/admin/practitioners/${id}`)),
  updatePractitioner: (id: number, body: T.PractitionerInput) =>
    data(request<{ data: T.AdminPractitioner }>(`/admin/practitioners/${id}`, { method: 'PATCH', body })),
  putHours: (id: number, hours: T.WorkingHours[]) =>
    data(request<{ data: T.WorkingHours[] }>(`/admin/practitioners/${id}/working-hours`, { method: 'PUT', body: { hours } })),
  timeOff: () => data(request<{ data: T.TimeOff[] }>('/admin/time-off')),
  addTimeOff: (body: { startsAt: string; endsAt: string; reason?: string; practitionerId?: number }) =>
    data(
      request<{ data: T.TimeOff & { clashingBookings: { reference: string; starts_at: string }[] } }>('/admin/time-off', {
        method: 'POST',
        body,
      }),
    ),
  deleteTimeOff: (id: number) => request<void>(`/admin/time-off/${id}`, { method: 'DELETE' }),

  settings: () => data(request<{ data: T.Settings }>('/admin/settings')),
  updateSettings: (patch: Partial<T.Settings>) =>
    data(request<{ data: T.Settings }>('/admin/settings', { method: 'PATCH', body: patch })),

  clients: (q = '') => data(request<{ data: T.ClientListItem[] }>(`/admin/clients${qs({ q })}`)),
  client: (id: number) => data(request<{ data: T.ClientDetail }>(`/admin/clients/${id}`)),
  updateClient: (id: number, body: Partial<Pick<T.ClientDetail, 'name' | 'phone' | 'email' | 'address'>>) =>
    data(request<{ data: T.ClientDetail }>(`/admin/clients/${id}`, { method: 'PATCH', body })),
  eraseClient: (id: number) => request<void>(`/admin/clients/${id}`, { method: 'DELETE' }),

  users: () => data(request<{ data: T.User[] }>('/admin/users')),
  createUser: (body: { email: string; name: string; password: string; role: T.User['role']; practitionerId?: number }) =>
    data(request<{ data: T.User }>('/admin/users', { method: 'POST', body })),
  updateUser: (id: number, body: Partial<Pick<T.User, 'name' | 'email' | 'role' | 'practitionerId' | 'isActive'>>) =>
    data(request<{ data: T.User }>(`/admin/users/${id}`, { method: 'PATCH', body })),
  resetPassword: (id: number, newPassword: string) =>
    request<void>(`/admin/users/${id}/password`, { method: 'POST', body: { newPassword } }),
}
