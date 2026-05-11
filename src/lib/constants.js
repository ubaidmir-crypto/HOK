// Admin passcode - change this before going live, or move to a Supabase Edge Function for real auth
export const ADMIN_PASS = 'hok2026';

export const CLINIC = {
  name: 'Hair of Kashmir',
  phone: '+919596366088',
  phoneDisplay: '+91 95963 66088',
  address: {
    line1: 'Hair of Kashmir Building',
    line2: 'Near Cancer Society of Kashmir',
    line3: 'Chanpora Bypass, Srinagar',
    line4: 'Jammu and Kashmir 190015',
  },
  hours: {
    weekdays: 'Mon - Fri (.) 10:00 - 18:00',
    saturday: 'Saturday (.) 10:00 - 16:00',
    sunday: 'Sunday (.) Closed',
  },
};

export const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];
export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
