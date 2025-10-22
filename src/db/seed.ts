import { db } from './index';
import { locations } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed locations
  const locationsData = [
    {
      city: 'tbilisi',
      districts: ['tsereteli', 'saburtalo', 'varketili', 'isani', 'gldani', 'dighomi', 'rustaveli'],
      translations: {
        en: {
          city: 'Tbilisi',
          districts: ['Tsereteli', 'Saburtalo', 'Varketili', 'Isani', 'Gldani', 'Dighomi', 'Rustaveli']
        },
        ka: {
          city: 'თბილისი',
          districts: ['წერეთელი', 'საბურთალო', 'ვარკეთილი', 'ისანი', 'გლდანი', 'დიღომი', 'რუსთაველი']
        },
        ru: {
          city: 'Тбилиси',
          districts: ['Церетели', 'Сабуртало', 'Варкетили', 'Исани', 'Глдани', 'Дигоми', 'Руставели']
        }
      }
    },
    {
      city: 'batumi',
      districts: [],
      translations: {
        en: { city: 'Batumi', districts: [] },
        ka: { city: 'ბათუმი', districts: [] },
        ru: { city: 'Батуми', districts: [] }
      }
    },
    {
      city: 'kutaisi',
      districts: [],
      translations: {
        en: { city: 'Kutaisi', districts: [] },
        ka: { city: 'ქუთაისი', districts: [] },
        ru: { city: 'Кутаиси', districts: [] }
      }
    },
    {
      city: 'rustavi',
      districts: [],
      translations: {
        en: { city: 'Rustavi', districts: [] },
        ka: { city: 'რუსთავი', districts: [] },
        ru: { city: 'Рустави', districts: [] }
      }
    },
    {
      city: 'poti',
      districts: [],
      translations: {
        en: { city: 'Poti', districts: [] },
        ka: { city: 'ფოთი', districts: [] },
        ru: { city: 'Поти', districts: [] }
      }
    },
    {
      city: 'zugdidi',
      districts: [],
      translations: {
        en: { city: 'Zugdidi', districts: [] },
        ka: { city: 'ზუგდიდი', districts: [] },
        ru: { city: 'Зугдиди', districts: [] }
      }
    },
    {
      city: 'telavi',
      districts: [],
      translations: {
        en: { city: 'Telavi', districts: [] },
        ka: { city: 'თელავი', districts: [] },
        ru: { city: 'Телави', districts: [] }
      }
    },
    {
      city: 'kobuleti',
      districts: [],
      translations: {
        en: { city: 'Kobuleti', districts: [] },
        ka: { city: 'ქობულეთი', districts: [] },
        ru: { city: 'Кобулети', districts: [] }
      }
    },
    {
      city: 'borjomi',
      districts: [],
      translations: {
        en: { city: 'Borjomi', districts: [] },
        ka: { city: 'ბორჯომი', districts: [] },
        ru: { city: 'Боржоми', districts: [] }
      }
    },
    {
      city: 'gori',
      districts: [],
      translations: {
        en: { city: 'Gori', districts: [] },
        ka: { city: 'გორი', districts: [] },
        ru: { city: 'Гори', districts: [] }
      }
    },
    {
      city: 'zestaponi',
      districts: [],
      translations: {
        en: { city: 'Zestaponi', districts: [] },
        ka: { city: 'ზესტაფონი', districts: [] },
        ru: { city: 'Зестафони', districts: [] }
      }
    },
    {
      city: 'other',
      districts: [],
      translations: {
        en: { city: 'Other', districts: [] },
        ka: { city: 'სხვა', districts: [] },
        ru: { city: 'Другое', districts: [] }
      }
    }
  ];

  await db.insert(locations).values(locationsData);

  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
