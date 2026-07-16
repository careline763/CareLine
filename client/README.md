# 🚗 CareLine - Customer Portal

Premium doorstep car care platform with luxury APEX MOTORS dark theme.

## 🌟 Features

- 🎨 Luxury dark theme with gold accents
- 📱 Fully responsive design
- 🛒 6-step booking flow
- 💳 Razorpay payment integration
- 🗺️ Interactive maps with Leaflet
- 🔔 Real-time notifications
- 📊 Booking history and tracking
- 💰 Wallet management
- 🎟️ Coupon system
- ⭐ Rating and reviews

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy**:

1. Push code to GitHub
2. Import project in Vercel
3. Set Root Directory to `client`
4. Add environment variables
5. Deploy!

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://your-api.com/api
VITE_SOCKET_URL=https://your-api.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## 📦 Tech Stack

- **React** 19.2.7
- **TypeScript** 6.0.2
- **Vite** 8.1.0
- **Tailwind CSS** 4.3.1
- **Zustand** (State Management)
- **React Router** 7.18.0
- **Axios** (HTTP Client)
- **Leaflet** (Maps)
- **Socket.io** (Real-time)

## 📁 Project Structure

```
client/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, icons
│   ├── components/  # Reusable components
│   ├── features/    # Zustand stores
│   ├── pages/       # Route pages
│   ├── routes/      # Route config
│   ├── services/    # API services
│   └── types/       # TypeScript types
├── .env             # Environment variables
├── vercel.json      # Vercel config
└── package.json
```

## 🎨 Design System

### Colors
- **Dark Base**: `#0A0A0A`
- **Dark Card**: `#141414`
- **Luxury Gold**: `#C5A880`

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Montserrat (Sans-serif)

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Oxlint |

## 🐛 Troubleshooting

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment variables not working
- Variables must start with `VITE_`
- Restart dev server after changes

## 📄 License

Proprietary and confidential. All rights reserved.
