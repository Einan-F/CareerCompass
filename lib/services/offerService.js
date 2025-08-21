import { supabase } from '../supabase'

export const offerService = {
  // Create new offer
  async create(offerData) {
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    const { data, error } = await supabase
      .from('offers')
      .insert({
        ...offerData,
        ...(userId && !offerData.user_id ? { user_id: userId } : {}),
      })
      .select(`
        *,
        applications (
          company_name,
          position_title
        )
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Get all offers
  async getAll() {
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        applications (
          company_name,
          position_title
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get offer by id
  async getById(id) {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        applications (
          company_name,
          position_title
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Update offer
  async update(id, updateData) {
    const { data, error } = await supabase
      .from('offers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete offer
  async delete(id) {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Get offer statistics
  async getStatistics() {
    const { data: offers, error } = await supabase
      .from('offers')
      .select('*')

    if (error) throw error

    return {
      totalOffers: offers.length,
      averageSalary: offers.reduce((acc, offer) => {
        if (offer.salary_type === 'monthly_global') {
          return acc + (offer.base_salary || 0)
        } else {
          return acc + ((offer.hourly_rate || 0) * (offer.monthly_hours || 0))
        }
      }, 0) / (offers.length || 1),
      statusDistribution: offers.reduce((acc, offer) => {
        acc[offer.status] = (acc[offer.status] || 0) + 1
        return acc
      }, {}),
      workTypeDistribution: offers.reduce((acc, offer) => {
        acc[offer.work_type] = (acc[offer.work_type] || 0) + 1
        return acc
      }, {})
    }
  }
}
