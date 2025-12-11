export interface District {
  id: string;
  name: {
    en: string;
    ka: string;
    ru: string;
  };
}

export interface City {
  id: string;
  name: {
    en: string;
    ka: string;
    ru: string;
  };
  districts: District[];
}

// Common "All" district for all cities
const allDistrict: District = {
  id: 'all',
  name: {
    en: 'All',
    ka: 'ყველა',
    ru: 'Все'
  }
};

export const locations: City[] = [
  {
    id: 'batumi',
    name: {
      en: 'Batumi',
      ka: 'ბათუმი',
      ru: 'Батуми'
    },
    districts: [allDistrict]
  },
  {
    id: 'kutaisi',
    name: {
      en: 'Kutaisi',
      ka: 'ქუთაისი',
      ru: 'Кутаиси'
    },
    districts: [allDistrict]
  },
  {
    id: 'rustavi',
    name: {
      en: 'Rustavi',
      ka: 'რუსთავი',
      ru: 'Рустави'
    },
    districts: [allDistrict]
  },
  {
    id: 'gori',
    name: {
      en: 'Gori',
      ka: 'გორი',
      ru: 'Гори'
    },
    districts: [allDistrict]
  },
  {
    id: 'zugdidi',
    name: {
      en: 'Zugdidi',
      ka: 'ზუგდიდი',
      ru: 'Зугдиди'
    },
    districts: [allDistrict]
  },
  {
    id: 'tbilisi',
    name: {
      en: 'Tbilisi',
      ka: 'თბილისი',
      ru: 'Тбилиси'
    },
    districts: [
      {
        id: 'tsereteli',
        name: {
          en: 'Tsereteli',
          ka: 'წერეთელი',
          ru: 'Церетели'
        }
      },
      {
        id: 'saburtalo',
        name: {
          en: 'Saburtalo',
          ka: 'საბურთალო',
          ru: 'Сабуртало'
        }
      },
      {
        id: 'varketili',
        name: {
          en: 'Varketili',
          ka: 'ვარკეთილი',
          ru: 'Варкетили'
        }
      },
      {
        id: 'isani',
        name: {
          en: 'Isani',
          ka: 'ისანი',
          ru: 'Исани'
        }
      },
      {
        id: 'gldani',
        name: {
          en: 'Gldani',
          ka: 'გლდანი',
          ru: 'Глдани'
        }
      },
      {
        id: 'dighomi',
        name: {
          en: 'Dighomi',
          ka: 'დიღომი',
          ru: 'Дигоми'
        }
      },
      {
        id: 'rustaveli',
        name: {
          en: 'Rustaveli',
          ka: 'რუსთაველი',
          ru: 'Руставели'
        }
      },
      allDistrict
    ]
  },
  {
    id: 'telavi',
    name: {
      en: 'Telavi',
      ka: 'თელავი',
      ru: 'Телави'
    },
    districts: [allDistrict]
  },
  {
    id: 'kobuleti',
    name: {
      en: 'Kobuleti',
      ka: 'ქობულეთი',
      ru: 'Кобулети'
    },
    districts: [allDistrict]
  },
  {
    id: 'borjomi',
    name: {
      en: 'Borjomi',
      ka: 'ბორჯომი',
      ru: 'Боржоми'
    },
    districts: [allDistrict]
  },
  {
    id: 'zestaponi',
    name: {
      en: 'Zestaponi',
      ka: 'ზესტაფონი',
      ru: 'Зестафони'
    },
    districts: [allDistrict]
  },
  {
    id: 'all',
    name: {
      en: 'All',
      ka: 'ყველა',
      ru: 'Все'
    },
    districts: [allDistrict]
  }
];
