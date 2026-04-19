useEffect(() => {
  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
      setBusinessName(data.business_name || '')
      setDescription(data.description || '')
      setWhatsapp(data.whatsapp || '')
    }
  }

  load()
}, [])