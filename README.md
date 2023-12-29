# Personal Finance Management with Next.js, Prisma, Supabase, and Vercel

This is a personal finance management project developed using the Next.js framework, Prisma as the ORM, Supabase as the database, and Vercel for hosting. With this application, you can track your income, expenses, and gain insights into your financial situation.

## Features

- **Transaction Logging:** Record your income and expenses to maintain accurate control of your finances.
- **Balance Visualization:** Get a clear view of your financial balance with charts and statistics.
- **Custom Categories:** Categorize your transactions for more detailed analysis.
- **Transaction History:** Access a complete history of all your transactions.

## Prerequisites

- Node.js
- npm or yarn
- Supabase account (https://supabase.io/)
- Vercel account (https://vercel.com/)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/gleidsonbalcazar/finansys_project.git
cd finansys_project
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables:

Create a `.env.local` file at the root of the project and add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-key
DATABASE_URL=your-database-url
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is set up for easy deployment on Vercel. Configure environment variables in the Vercel dashboard to reflect those in the `.env.local` file.

## Contribution

Feel free to contribute improvements, bug fixes, or new features. Open an issue to discuss major changes before submitting a pull request.

## Translation (I18n)

We are working on adding internationalization (I18n) support for translations. Feel free to contribute translations for missing issues.

## License

This project is licensed under the [MIT License](LICENSE).

---

We hope this application makes it easier for you to manage your personal finances. If you have any questions or suggestions, feel free to get in touch.

Enjoy!

[Gleidson Balcazar]
[gleidsonsbalcazar@gmail.com]
