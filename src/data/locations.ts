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

// Common "Other" district for all cities
const otherDistrict: District = {
  id: 'other',
  name: {
    en: 'Other',
    ka: 'სხვა',
    ru: 'Другое'
  }
};

export const locations: City[] = [
  {
    id: 'other',
    name: {
      en: 'Other',
      ka: 'სხვა',
      ru: 'Другое'
    },
    districts: [otherDistrict]
  },
  {
    id: 'batumi',
    name: {
      en: 'Batumi',
      ka: 'ბათუმი',
      ru: 'Батуми'
    },
    districts: [otherDistrict]
  },
  {
    id: 'kutaisi',
    name: {
      en: 'Kutaisi',
      ka: 'ქუთაისი',
      ru: 'Кутаиси'
    },
    districts: [otherDistrict]
  },
  {
    id: 'rustavi',
    name: {
      en: 'Rustavi',
      ka: 'რუსთავი',
      ru: 'Рустави'
    },
    districts: [otherDistrict]
  },
  {
    id: 'gori',
    name: {
      en: 'Gori',
      ka: 'გორი',
      ru: 'Гори'
    },
    districts: [otherDistrict]
  },
  {
    id: 'zugdidi',
    name: {
      en: 'Zugdidi',
      ka: 'ზუგდიდი',
      ru: 'Зугдиди'
    },
    districts: [otherDistrict]
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
      otherDistrict
    ]
  },
  {
    id: 'telavi',
    name: {
      en: 'Telavi',
      ka: 'თელავი',
      ru: 'Телави'
    },
    districts: [otherDistrict]
  },
  {
    id: 'kobuleti',
    name: {
      en: 'Kobuleti',
      ka: 'ქობულეთი',
      ru: 'Кобулети'
    },
    districts: [otherDistrict]
  },
  {
    id: 'borjomi',
    name: {
      en: 'Borjomi',
      ka: 'ბორჯომი',
      ru: 'Боржоми'
    },
    districts: [otherDistrict]
  },
  {
    id: 'zestaponi',
    name: {
      en: 'Zestaponi',
      ka: 'ზესტაფონი',
      ru: 'Зестафони'
    },
    districts: [otherDistrict]
  }
];
