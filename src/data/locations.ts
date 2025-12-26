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
        id: 'avlabari',
        name: {
          en: 'Avlabari',
          ka: 'ავლაბარი',
          ru: 'Авлабари'
        }
      },
      {
        id: 'didi-dighomi',
        name: {
          en: 'Didi Dighomi',
          ka: 'დიდი დიღომი',
          ru: 'Диди Дигоми'
        }
      },
      {
        id: 'didube',
        name: {
          en: 'Didube',
          ka: 'დიდუბე',
          ru: 'Дидубе'
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
        id: 'gldani',
        name: {
          en: 'Gldani',
          ka: 'გლდანი',
          ru: 'Глдани'
        }
      },
      {
        id: 'grmagele',
        name: {
          en: 'Grmagele',
          ka: 'გრმაგელე',
          ru: 'Грмагеле'
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
        id: 'marjanishvili',
        name: {
          en: 'Marjanishvili',
          ka: 'მარჯანიშვილი',
          ru: 'Марджанишвили'
        }
      },
      {
        id: 'nadzaladevi',
        name: {
          en: 'Nadzaladevi',
          ka: 'ნაძალადევი',
          ru: 'Надзаладеви'
        }
      },
      {
        id: 'ortachala',
        name: {
          en: 'Ortachala',
          ka: 'ორთაჭალა',
          ru: 'Ортачала'
        }
      },
      {
        id: 'other',
        name: {
          en: 'Other',
          ka: 'სხვა',
          ru: 'Другое'
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
      {
        id: 'saburtalo',
        name: {
          en: 'Saburtalo',
          ka: 'საბურთალო',
          ru: 'Сабуртало'
        }
      },
      {
        id: 'temka',
        name: {
          en: 'Temka',
          ka: 'თემქა',
          ru: 'Темка'
        }
      },
      {
        id: 'tsereteli',
        name: {
          en: 'Tsereteli',
          ka: 'წერეთელი',
          ru: 'Церетели'
        }
      },
      {
        id: 'vake',
        name: {
          en: 'Vake',
          ka: 'ვაკე',
          ru: 'Ваке'
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
