# Masjid Raya Pulo Asem

Website resmi Masjid Raya Pulo Asem - Jakarta Timur

## Tentang Project

Website ini merupakan portal informasi Masjid Raya Pulo Asem yang menyediakan:
- Informasi tentang masjid (sejarah, visi & misi)
- Jadwal sholat real-time untuk wilayah Jakarta
- Kegiatan dan program masjid
- Informasi donasi dan zakat
- Dan berbagai informasi lainnya

## Demo

Website dapat diakses di: [https://azharsetiawan.github.io/masjidrayapuloasem](https://azharsetiawan.github.io/masjidrayapuloasem)

## Tech Stack

Project ini dibangun menggunakan:

- **Vite** - Build tool dan dev server
- **React 18** - Library untuk UI
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Komponen UI yang dapat disesuaikan
- **React Router** - Routing
- **TanStack Query** - Data fetching dan state management
- **Lucide React** - Icon library

## Development

### Prerequisites

- Node.js (v18 atau lebih tinggi)
- npm atau bun

### Installation

```bash
# Clone repository
git clone git@github.com:azharsetiawan/masjidrayapuloasem.git

# Masuk ke directory project
cd masjidrayapuloasem

# Install dependencies
npm install
# atau jika menggunakan bun
bun install
```

### Running Development Server

```bash
# Jalankan development server
npm run dev
# atau
bun run dev
```

Server akan berjalan di `http://localhost:8080`

### Build for Production

```bash
# Build project
npm run build
# atau
bun run build
```

Hasil build akan ada di folder `dist/`

### Preview Production Build

```bash
# Preview hasil build
npm run preview
# atau
bun run preview
```

## Deployment

Project ini menggunakan GitHub Actions untuk otomatis deploy ke GitHub Pages.

Setiap push ke branch `main` akan otomatis trigger build dan deployment.

Workflow file: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

## Project Structure

```
masjidrayapuloasem/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── PrayerSchedule.tsx
│   │   ├── ActivitiesSection.tsx
│   │   ├── DonationSection.tsx
│   │   └── Footer.tsx
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── .github/
│   └── workflows/        # GitHub Actions workflows
└── vite.config.ts        # Vite configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Contributing

Kontribusi sangat diterima! Jika ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## License

Project ini dibuat untuk Masjid Raya Pulo Asem.

## Contact

Untuk informasi lebih lanjut, silakan hubungi pengurus Masjid Raya Pulo Asem.
