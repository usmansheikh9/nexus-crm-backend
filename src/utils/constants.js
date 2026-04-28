const ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  VIEWER: 'viewer',
};

const CLIENT_STATUS = {
  LEAD:     'lead',
  ACTIVE:   'active',
  INACTIVE: 'inactive',
  CLOSED:   'closed',
};

const CLIENT_PRIORITY = {
  LOW:    'low',
  MEDIUM: 'medium',
  HIGH:   'high',
};

const CLIENT_SOURCE = {
  REFERRAL:     'referral',
  WEBSITE:      'website',
  COLD_OUTREACH: 'cold-outreach',
  SOCIAL:       'social',
  OTHER:        'other',
};

module.exports = { ROLES, CLIENT_STATUS, CLIENT_PRIORITY, CLIENT_SOURCE };
