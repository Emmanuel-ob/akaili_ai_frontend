// utils/dataUtils.js
export async function getMergedCampaignData() {
  const [campaignRes, analyticsRes] = await Promise.all([
    fetch('/data/campaigns.json'),
    fetch('/data/analytics.json')
  ])

  const [campaigns, analytics] = await Promise.all([
    campaignRes.json(),
    analyticsRes.json()
  ])

  // Merge on campaign.id === analytics.campaign_id
  return campaigns.map(campaign => {
    const stats = analytics.find(a => a.campaign_id === campaign.id)
    return {
      id: campaign.id,
      name: campaign.title,
      status: campaign.status === 'sent' ? 'Active' : 'Draft',
      emailsSent: campaign.emailsSent || 0,
      createdAt: campaign.send_date,
      description: campaign.description || 'No description provided.',
      content: campaign.content || 'Email content not yet created.',
      opens: stats?.opens || 0,
      clicks: stats?.clicks || 0,
      bounces: stats?.bounces || 0,
      conversion_rate: stats?.conversion_rate || 0
    }
  })
}
