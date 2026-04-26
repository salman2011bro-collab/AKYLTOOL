import { supabase } from './supabaseClient';
import React, { useState, useEffect, useRef } from 'react';
import { Users, Map, Lock, CheckCircle2, Save, Globe, Sun, Moon, Utensils, Menu } from 'lucide-react';
import { saveDutyClass, saveLocation, saveMapState, subscribeToDutyClass, subscribeToLocation, subscribeToMapState, getInitialData } from './firebase';
const dutyRotation = ["7A", "7B", "7C", "8A", "8B", "8C", "9A", "9B", "9C", "10A", "10B"];
const getTodayClass = () => dutyRotation[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dutyRotation.length];
const todayClass = getTodayClass();
const editorCodes = ["7A", "7B", "7C", "8A", "8B", "8C", "9A", "9B", "9C", "10A", "10B"];
const classCodes = editorCodes;
const superAdminCode = "7777";

const classStudents = {
  '7A': {
    girls: ['Аяна Анарбаева','Айгерим Асанакунова','Айгерим Бузурманкулова','Белинай Бурканова','Раяна Жоробаева','Жибек Жумабекова','Арууке Кабатаева','Асемa Максатова','Нурайым Муратбекова','Акманай Ниязбекова','Саида Сыргакова'],
    boys: ['Нуртилек Абдыашым','Надирбек Абдыжапар','Нурэл Асилбеков','Нуржан Камалидин','Мустафо Камаржонов','Бакай Кудайбердиев','Дастан Майрамбек','Исанур Пирматов','Нурбакыт Табышев','Рысбек Турсунов','Таалим Турумбеков','Айтенир Усенов','Рамазан Хайткулов']
  },
  '7B': {
    girls: ['Раяна Азимова','Айчурок Алмазбекова','Адеми Бактыбекова','Мирайым Булатбекова','Мээрим Жакшибаева','Нуркыз Кадырова','Батма Конурбаева','Айтумар Мухтарова','Айсулуу Орозова','Бегимай Рыскулбекова','Амина Эркинбаева'],
    boys: ['Нурислам Абдиталипов','Тилек Абдыкамилов','Умар Акбаралиев','Марсель Бакиров','Микаил Кудайбергенов','Суймонкул Култаев','Гулжигит Курбанбеков','Нурдан Насырынбеков','Уларбек Орозобеков','Эламан Сабыров','Байсал Сапарбаев','Ринат Тураров','Сулайман Уланов']
  },
  '7C': {
    girls: ['Мадина Абдибахапова','Адия Замирбекова','Раяна Ибраимова','Медина Камчыбекова','Раяна Колдошбаева','Аделя Кылычбекова','Айдана Мусуратиллаева','Арууке Садывалиева','Раяна Таштанова','Нурпери Тилебалдиева'],
    boys: ['Дастан Абдукаримов','Теитбек Абдыманапов','Кутман Алмазбеков','Залкар Аратов','Байэл Баатырбеков','Барчынбек Жаманаков','Демир Иманудинов','Абай Кубанычбеков','Нурел Равшанбеков','Умар Сайпидинов','Мухаммед Субанбеков','Акылбек Суйунбаев','Нурсултан Токтогулов','Али Эрнистов']
  },
  '8A': {
    girls: ['Арууке Айдарбекова','Назима Баркалбасова','Асемa Догдурбекова','Сезим Ирискулова','Нурзада Кошманова','Бермет Муктарова','Каныкей Рахманова','Асемa Тошбулатова','Арууке Узакбаева','Ширин Усенова','Амина Шакирова'],
    boys: ['Баязет Абдигапаров','Умар Акбаралиев','Ариет Акпаров','Талант Аманов','Ырыскелди Асанкулов','Умар Атамкулов','Амантур Камбаров','Улук Кубанычбеков','Арлан Мирпазылов','Торокелди Омуралиев','Искендер Салыбеков','Альберт Турдалиев','Даниел Уланбеков','Бекболот Эшназаров']
  },
  '8B': {
    girls: ['Айбийке Абыталиева','Элина Азимжанова','Аэлина Аманбекова','Мухсина Камаржонова','Айсуна Карымшакова','Амина Касымалиева','Айжан Качкынова','Алина Кенжебекова','Мээрим Кубанычбекова','Мээрим Ормонова','Арууке Осорбаева'],
    boys: ['Салман Абакиров','Алан Абдукаимов','Ариет Акбаралиев','Кутман Акбаралиев','Алихан Акылбеков','Нуркелди Алибеков','Байзак Алтымышбеков','Салманбек Анарбаев','Эржан Бейшенов','Амир Кутанов','Эльдар Нураков','Санжар Нургазиев','Марсель Эгемкулов','Санжар Эсенаманов']
  },
  '8C': {
    girls: ['Акылай Айылчиева','Амина Дегембаева','Сумайа Досбаева','Нуркыз Ибайдиллаева','Айбийке Ильгизова','Аяна Каюмова','Элина Русланова','Айбийке Семетеева','Камила Торогазиева','Медина Чаткалбаева','Малика Шайымкулова'],
    boys: ['Нурадил Абдиманапов','Элмырза Абдимиталипов','МухтарАли Асанбеков','Рамис Аскербеков','Али Атамкулов','Алихан Ахунбаев','Рамзан Догдурбаев','Нурэл Кадыров','Эрали Камбаров','Тимур Кенешбеков','Эрнист Кубатбеков','Заирбек Таабалдыев','Нурали Текинов','Толубай Токтосунов']
  },
  '9A': {
    girls: ['Элназа Абдимуталова','Чолпон Абзелова','Аруубек Баймырзаева','Тазагул Доолатбекова','Аксаамай Жумашева','Сезим Ибраимкулова','Айзирек Изакжанова','Фатима Муратаалиева','Асия Ниязова','Эльзира Нурматова','Адина Рысбаева','Анжелика Сыргаева','Анархан Таалайбекова','Алия Узакова','Айэлес Эмилбекова'],
    boys: ['Шерхан Амангелдиев','Нурсултан Исаев','Каныкей Кубатбеков','Бактыбек Муминов','Атамбек Сайтмуратов','Медербек Сексенбаев','Енисей Сымбатбеков','Адилет Тажибаев']
  },
  '9B': {
    girls: ['Айжамал Абдилазиз кызы','Жылдыз Абдилазиз кызы','Сезим Айылчиева','Шагзада Баатырбекова','Айназик Дайырова','Айзирек Жайлообаева','Бурул Жороева','Акылжан Мелисбекова','Айдай Мустапакулова','Муслима Тайирбекова','Фатима Толондуева','Камила Тынчылык кызы','Нуриза Ырыскулова','Азалина Элнурова'],
    boys: ['Актилек Абдиллаев','Азамат Абдираимов','Адилет Арзибеков','Ариэл Асангельдиев','Алихан Аттокуров','Алим Бараканов','Ратбек Каримжанов','Аден Максатбеков','Данияр Мукашов']
  },
  '9C': {
    girls: ['Гулзинат Алимырзаева','Адеми Ержанова','Нуркыз Жолчуева','Аделина Жорокулова','Айэлита Жумабекова','Нурпери Каныбекова','Рахия Маматкаримова','Айдана Махсидова','Гулмира Мусаева','Асемa Орунбекова','Бегимай Сакенова','Акмаанай Сонунбекова','Наргиз Талантбекова','Каныкей Талипжанова','Раяна Эрмекбаева'],
    boys: ['Нурэл Билалов','Абдуллох Джураев','Нурмухамед Маматганыев','Атай Рахатбеков','Расулбек Рахимбердиев','Айбек Самиев','Болотбеков Санат','Байсун Тургунбаев','Айвар Тынчтыкбеков']
  },
  '10A': {
    girls: ['Кыял Абдижапарова','Сайкал Бейшенбекова','Акак Жакшылык кызы','Изабелла Жусупова','Есфира Замирова','Мираида Кадырова','Айбийке Памирова','Арууке Парпиева','Адина Сабырбекова','Адинай Сагалыева','Наргиза Суранбаева','Каныкей Шадыбекова'],
    boys: ['Баймат Абдувалиев','Ильгиз Адилбеков','Темирлан Байгазиев','Амир Бапаев','Нуртилек Жолдошбеков','Азат Керимбеков','Элмырза Кудайбергенов','Нурислам Матаев','Нурали Сулайманов','Эрбол Турдакунов','Арген Чурмуков','Ислам Эрасланов']
  },
  '10B': {
    girls: ['Арууке Алибаева','Аяна Батырбекова','Медина Дайырбекова','Арууке Мурзаева','Нурайым Мухаматназарова','Азема Нуржамалова','Бегайым Сардарова','Медина Султанова','Нурайым Суйунбаева','Айназик Узакова','Периште Ырыскулова'],
    boys: ['Барсбек Абдимиталипов','Барсбек Акылбеков','Эмир Джанышбеков','Эрбол Жолдошбеков','Эмир Искендеров','Алинур Кадыров','Нурмухаммед Каримжанов','Шабдан Келдибаев','Улукмырза Кызайбеков','Адиль Сагынов','Данияр Темирбеков','Байэл Хатамалиев']
  }
};

const dutySlots = ['breakfast','tea1','lunch','dinner','tea2'];

const getEmptyAssignments = () => classCodes.reduce((acc, cls) => {
  acc[cls] = { boys: { breakfast: [], tea1: [], lunch: [], dinner: [], tea2: [] }, girls: { breakfast: [], tea1: [], lunch: [], dinner: [], tea2: [] } };
  return acc;
}, {});

const loadAssignments = () => {
  if (typeof window === 'undefined') return getEmptyAssignments();
  try {
    const stored = window.localStorage.getItem('akyltool_duty_assignments');
    return stored ? JSON.parse(stored) : getEmptyAssignments();
  } catch {
    return getEmptyAssignments();
  }
};

const loadMapState = () => {
  if (typeof window === 'undefined') return { selectedMapFloor: '1', mapPoints: { '1': null, '2': null, '3': null } };
  try {
    const selectedMapFloor = window.localStorage.getItem('akyltool_map_floor') || '1';
    const storedPoints = JSON.parse(window.localStorage.getItem('akyltool_map_points') || '{}');
    return {
      selectedMapFloor,
      mapPoints: {
        '1': storedPoints?.['1'] || null,
        '2': storedPoints?.['2'] || null,
        '3': storedPoints?.['3'] || null
      }
    };
  } catch {
    return { selectedMapFloor: '1', mapPoints: { '1': null, '2': null, '3': null } };
  }
};

const timeBlocks = [
  { key: 'breakfast', start: 7 * 60 + 0, end: 7 * 60 + 40 },
  { key: 'tea1', start: 10 * 60 + 20, end: 10 * 60 + 40 },
  { key: 'lunch', start: 12 * 60 + 55, end: 13 * 60 + 55 },
  { key: 'dinner', start: 18 * 60 + 0, end: 18 * 60 + 50 },
  { key: 'tea2', start: 20 * 60 + 55, end: 21 * 60 + 15 }
];

const mapFloorImages = {
  '1': '/map_1-floor.png',
  '2': '/map_2-floor.png',
  '3': '/map_3-floor.png'
};

const mapFloorLabels = {
  en: ['Floor 1', 'Floor 2', 'Floor 3'],
  kg: ['1-кабат', '2-кабат', '3-кабат']
};

const mealLabels = {
  en: {
    breakfast: { name: 'Breakfast', time: '7:00-7:45' },
    tea1: { name: 'Tea 1', time: '10:20' },
    lunch: { name: 'Lunch', time: '12:55' },
    dinner: { name: 'Dinner', time: '18:00' },
    tea2: { name: 'Tea 2', time: '20:55' }
  },
  kg: {
    breakfast: { name: 'Breakfast', time: '7:00-7:45' },
    tea1: { name: 'Tea 1', time: '10:20' },
    lunch: { name: 'Lunch', time: '12:55' },
    dinner: { name: 'Dinner', time: '18:00' },
    tea2: { name: 'Tea 2', time: '20:55' }
  }
};

const simpleMealSummary = {
  en: [
    { breakfast: 'Oatmeal (250g)', lunch: 'Borscht (300g) + Buckwheat (250g)', dinner: 'Plov (350g)' },
    { breakfast: 'Rice porridge (250g)', lunch: 'Mastava (300g) + Pasta (250g)', dinner: 'Manti (300g)' },
    { breakfast: 'Fried eggs (2pcs)', lunch: 'Shorpo (300g) + Potatoes (250g)', dinner: 'Chicken with Rice (300g)' },
    { breakfast: '7-grain porridge (250g)', lunch: 'Laghman (350g)', dinner: 'Meatballs with Spaghetti (300g)' },
    { breakfast: 'Semolina (250g)', lunch: 'Lentil soup (300g) + Fish (250g)', dinner: 'Kuurdak (300g)' },
    { breakfast: 'Pancakes (200g)', lunch: 'Light soups & Tea snacks', dinner: 'Light soups & Tea snacks' },
    { breakfast: 'Pancakes (200g)', lunch: 'Light soups & Tea snacks', dinner: 'Light soups & Tea snacks' }
  ],
  kg: [
    { breakfast: 'Oatmeal (250g)', lunch: 'Borscht (300g) + Buckwheat (250g)', dinner: 'Plov (350g)' },
    { breakfast: 'Rice porridge (250g)', lunch: 'Mastava (300g) + Pasta (250g)', dinner: 'Manti (300g)' },
    { breakfast: 'Fried eggs (2pcs)', lunch: 'Shorpo (300g) + Potatoes (250g)', dinner: 'Chicken with Rice (300g)' },
    { breakfast: '7-grain porridge (250g)', lunch: 'Laghman (350g)', dinner: 'Meatballs with Spaghetti (300g)' },
    { breakfast: 'Semolina (250g)', lunch: 'Lentil soup (300g) + Fish (250g)', dinner: 'Kuurdak (300g)' },
    { breakfast: 'Pancakes (200g)', lunch: 'Light soups & Tea snacks', dinner: 'Light soups & Tea snacks' },
    { breakfast: 'Pancakes (200g)', lunch: 'Light soups & Tea snacks', dinner: 'Light soups & Tea snacks' }
  ]
};

const weeklyMenu = {
  en: [
    [
      {
        day: 'Mon',
        meals: {
          breakfast: 'Достук ботко, Запеканка, Кыям, Нан/Май, Чай',
          tea1: 'Таттуу токоч, Чай',
          lunch: 'Жупка, Картошка котлет менен, Фунчеза, Шербет',
          dinner: 'Сырный суп, Спагетти, Жер-жемиш, Чай',
          tea2: 'Самсы, Чай'
        }
      },
      {
        day: 'Tue',
        meals: {
          breakfast: '7 дан боткосу, Сууга бышкан жумуртка, Кыям, Нан/Май, Чай',
          tea1: 'Кекс ашкабак менен, Чай',
          lunch: 'Тоок эти менен шорпо, Вермишель, Освежающий салат, Шербет',
          dinner: 'Харчо, Оромо, Жер-жемиш, Чай',
          tea2: 'Пирожки картошка менен, Биокефир'
        }
      },
      {
        day: 'Wed',
        meals: {
          breakfast: 'Ячко боткосу, Лаваш сыр менен, Бал, Нан/Май, Чай',
          tea1: 'Таттуу токоч какао менен, Чай',
          lunch: 'Жашылча шорпосу, Палоо (плов), Шакарам, Шербет',
          dinner: 'Казак шорпосу, Гречка гуляш менен, Жер-жемиш, Чай',
          tea2: 'Куриник, Биокефир'
        }
      },
      {
        day: 'Thu',
        meals: {
          breakfast: 'Куруч боткосу, Быштак десерт, Кыям, Нан/Май, Чай',
          tea1: 'Шарлотка алма менен, Чай',
          lunch: 'Мампар, Булгур тоок эти менен, Витаминка салат, Шербет',
          dinner: 'Щи фасоль менен, Хошан, Жер-жемиш, Чай',
          tea2: 'Конфет/Печенье, Чай'
        }
      },
      {
        day: 'Fri',
        meals: {
          breakfast: 'Достук боткосу, Картошка тоок эти менен, Бал, Нан/Май, Чай',
          tea1: 'Ревани, Чай',
          lunch: 'Эт шорпосу, Түрк палоосу, Шакарам, Шербет',
          dinner: 'Кытай шорпосу, Картошка эт менен, Жер-жемиш, Чай',
          tea2: 'Пицца, Биокефир'
        }
      },
      {
        day: 'Sat',
        meals: {
          breakfast: 'Ашкабак боткосу, Тутук лаваш, Каймак, Нан/Май, Чай',
          tea1: 'Сочинский быштак менен, Чай',
          lunch: 'Фрикадельки шорпосу, Гуйру лагман, Сабиз салаты, Шербет',
          dinner: 'Ак буурчак шорпосу, Ак күрүч эт менен, Жер-жемиш, Чай',
          tea2: 'Пончик, Чай'
        }
      },
      {
        day: 'Sun',
        meals: {
          breakfast: 'Омлет помидор менен, Быштак десерт, Кыям, Нан/Май, Чай',
          tea1: 'Печенье, Чай',
          lunch: 'Чечевица шорпосу, Гуляш макарон менен, Фунчеза, Шербет',
          dinner: 'Чоң эне шорпосу, Рагу тоок эти менен, Жер-жемиш, Чай',
          tea2: 'Рулет мак менен, Биокефир'
        }
      }
    ],
    [
      {
        day: 'Mon',
        meals: {
          breakfast: 'Ашкабак кошулган ичке ботко (200г), Омлет лаваш менен (150г), Бал, Нан, каймак май, Сүт чайы',
          tea1: 'Мадлен (50г), Шербет чайы (200г)',
          lunch: 'Борщ (300г), Булгур тоок эти менен (300г), "Свежий" салаты, Нан, Шербет',
          dinner: 'Үй кесмеси эт менен (300г), Гуляш гречка менен (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Самсы эт менен (60г), Биокефир (200г)'
        }
      },
      {
        day: 'Tue',
        meals: {
          breakfast: '"Достук" боткосу (200г), Оладий сметана менен (150г), Кыям, Нан, каймак май, Сүт чайы',
          tea1: 'Таттуу токоч (50г), Чай шекер менен (200г)',
          lunch: 'Эт шорпосу (300г), Палоо эт менен (300г), "Шакарап" салаты, Нан, Шербет',
          dinner: 'Рассольник (300г), Оромо эт, жашылча менен (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Пирожки картошка менен (70г), Чай шекер менен (200г)'
        }
      },
      {
        day: 'Wed',
        meals: {
          breakfast: '"7 дан" боткосу (200г), Сууга бышкан жумуртка (1 даана), Кыям, Нан, каймак май, Сүт чайы',
          tea1: 'Быштак пирогу (50г), Чай шекер менен (200г)',
          lunch: 'Фрикадельки шорпосу (300г), Бешбармак (300г), Жашылча салаты, Нан, Шербет',
          dinner: 'Мампар (300г), Куурдак уй эти менен (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Булочка сгущенка менен (60г), Биокефир (200г)'
        }
      },
      {
        day: 'Thu',
        meals: {
          breakfast: 'Күрүч сүт боткосу (200г), Быштак десерти (150г), Запеканка жашылча менен, Нан, каймак май, Сүт чайы',
          tea1: 'Печенье (50г), Чай шекер менен (200г)',
          lunch: 'Казак шорпосу (300г), Картошка балык менен (300г), "Витаминка" салаты, Нан, Шербет',
          dinner: 'Чечевица шорпосу (300г), Вермишель эт менен (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Рулет мак, грек жаңгагы м-н (50г), Чай шекер менен (200г)'
        }
      },
      {
        day: 'Fri',
        meals: {
          breakfast: '"Достук" боткосу (200г), Түтүк лаваш менен (150г), Бал, Нан, каймак май, Сүт чайы',
          tea1: 'Кекс алма менен (50г), Чай шекер менен (200г)',
          lunch: 'Эт шорпосу (300г), Палоо эт менен (300г), "Шакарап" салаты, Нан, Шербет',
          dinner: 'Жашылча шорпосу (300г), Манты эт, жашылча м-н (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Конфет, печенье (60г), Биокефир (200г)'
        }
      },
      {
        day: 'Sat',
        meals: {
          breakfast: 'Ашкабак кошулган таруу боткосу (200г), Плавленный сыр (90г), Сууга бышкан жумуртка (1 даана), Нан, каймак май, Сүт чайы',
          tea1: 'Пирог повидло менен (50г), Чай шекер менен (200г)',
          lunch: 'Тоок эти шорпосу (300г), Уй этинен куурдак (300г), "Освежающий" салаты, Нан, Шербет',
          dinner: 'Щи фасоль менен (300г), Дапанжи (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Ватрушка быштак менен (50г), Чай шекер менен (200г)'
        }
      },
      {
        day: 'Sun',
        meals: {
          breakfast: 'Картошка сыр, жумуртка менен (150г), Каймак, Кыям, Нан, каймак май, Сүт чайы',
          tea1: 'Быштак печеньеси (50г), Чай шекер менен (200г)',
          lunch: 'Жумуртка кошулган шорпо (300г), Гуляш макарон менен (300г), "Оливье" салаты, Нан, Шербет',
          dinner: '"Чоң эне" шорпосу (300г), Ган-фан (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Пирожки күрүч, жумуртка м-н (80г), Биокефир (200г)'
        }
      }
    ]
  ],
  kg: [
    [
      {
        day: 'Дүйшөмбү',
        meals: {
          breakfast: 'Достук ботко, Запеканка, Кыям, Нан/Май, Чай',
          tea1: 'Таттуу токоч, Чай',
          lunch: 'Жупка, Картошка котлет менен, Фунчеза, Шербет',
          dinner: 'Сырный суп, Спагетти, Жер-жемиш, Чай',
          tea2: 'Самсы, Чай'
        }
      },
      {
        day: 'Шейшемби',
        meals: {
          breakfast: '7 дан боткосу, Сууга бышкан жумуртка, Кыям, Нан/Май, Чай',
          tea1: 'Кекс ашкабак менен, Чай',
          lunch: 'Тоок эти менен шорпо, Вермишель, Освежающий салат, Шербет',
          dinner: 'Харчо, Оромо, Жер-жемиш, Чай',
          tea2: 'Пирожки картошка менен, Биокефир'
        }
      },
      {
        day: 'Шаршемби',
        meals: {
          breakfast: 'Ячко боткосу, Лаваш сыр менен, Бал, Нан/Май, Чай',
          tea1: 'Таттуу токоч какао менен, Чай',
          lunch: 'Жашылча шорпосу, Палоо (плов), Шакарам, Шербет',
          dinner: 'Казак шорпосу, Гречка гуляш менен, Жер-жемиш, Чай',
          tea2: 'Куриник, Биокефир'
        }
      },
      {
        day: 'Бейшемби',
        meals: {
          breakfast: 'Куруч боткосу, Быштак десерт, Кыям, Нан/Май, Чай',
          tea1: 'Шарлотка алма менен, Чай',
          lunch: 'Мампар, Булгур тоок эти менен, Витаминка салат, Шербет',
          dinner: 'Щи фасоль менен, Хошан, Жер-жемиш, Чай',
          tea2: 'Конфет/Печенье, Чай'
        }
      },
      {
        day: 'Жума',
        meals: {
          breakfast: 'Достук боткосу, Картошка тоок эти менен, Бал, Нан/Май, Чай',
          tea1: 'Ревани, Чай',
          lunch: 'Эт шорпосу, Түрк палоосу, Шакарам, Шербет',
          dinner: 'Кытай шорпосу, Картошка эт менен, Жер-жемиш, Чай',
          tea2: 'Пицца, Биокефир'
        }
      },
      {
        day: 'Ишемби',
        meals: {
          breakfast: 'Ашкабак боткосу, Тутук лаваш, Каймак, Нан/Май, Чай',
          tea1: 'Сочинский быштак менен, Чай',
          lunch: 'Фрикадельки шорпосу, Гуйру лагман, Сабиз салаты, Шербет',
          dinner: 'Ак буурчак шорпосу, Ак күрүч эт менен, Жер-жемиш, Чай',
          tea2: 'Пончик, Чай'
        }
      },
      {
        day: 'Жекшемби',
        meals: {
          breakfast: 'Омлет помидор менен, Быштак десерт, Кыям, Нан/Май, Чай',
          tea1: 'Печенье, Чай',
          lunch: 'Чечевица шорпосу, Гуляш макарон менен, Фунчеза, Шербет',
          dinner: 'Чоң эне шорпосу, Рагу тоок эти менен, Жер-жемиш, Чай',
          tea2: 'Рулет мак менен, Биокефир'
        }
      }
    ],
    [
      {
        day: 'Дүйшөмбү',
        meals: {
          breakfast: 'Ашкабак кошулган ичке ботко (200г), Омлет лаваш менен (150г), Бал, Нан, каймак май, Сүт чайы',
          tea1: 'Мадлен (50г), Шербет чайы (200г)',
          lunch: 'Борщ (300г), Булгур тоок эти менен (300г), "Свежий" салаты, Нан, Шербет',
          dinner: 'Үй кесмеси эт менен (300г), Гуляш гречка менен (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Самсы эт менен (60г), Биокефир (200г)'
        }
      },
      {
        day: 'Шейшемби',
        meals: {
          breakfast: '"Достук" боткосу (200г), Оладий сметана менен (150г), Кыям, Нан, каймак май, Сүт чайы',
          tea1: 'Таттуу токоч (50г), Чай шекер менен (200г)',
          lunch: 'Эт шорпосу (300г), Палоо эт менен (300г), "Шакарап" салаты, Нан, Шербет',
          dinner: 'Рассольник (300г), Оромо эт, жашылча менен (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Пирожки картошка менен (70г), Чай шекер менен (200г)'
        }
      },
      {
        day: 'Шаршемби',
        meals: {
          breakfast: '"7 дан" боткосу (200г), Сууга бышкан жумуртка (1 даана), Кыям, Нан, каймак май, Сүт чайы',
          tea1: 'Быштак пирогу (50г), Чай шекер менен (200г)',
          lunch: 'Фрикадельки шорпосу (300г), Бешбармак (300г), Жашылча салаты, Нан, Шербет',
          dinner: 'Мампар (300г), Куурдак уй эти менен (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Булочка сгущенка менен (60г), Биокефир (200г)'
        }
      },
      {
        day: 'Бейшемби',
        meals: {
          breakfast: 'Күрүч сүт боткосу (200г), Быштак десерти (150г), Запеканка жашылча менен, Нан, каймак май, Сүт чайы',
          tea1: 'Печенье (50г), Чай шекер менен (200г)',
          lunch: 'Казак шорпосу (300г), Картошка балык менен (300г), "Витаминка" салаты, Нан, Шербет',
          dinner: 'Чечевица шорпосу (300г), Вермишель эт менен (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Рулет мак, грек жаңгагы м-н (50г), Чай шекер менен (200г)'
        }
      },
      {
        day: 'Жума',
        meals: {
          breakfast: '"Достук" боткосу (200г), Түтүк лаваш менен (150г), Бал, Нан, каймак май, Сүт чайы',
          tea1: 'Кекс алма менен (50г), Чай шекер менен (200г)',
          lunch: 'Эт шорпосу (300г), Палоо эт менен (300г), "Шакарап" салаты, Нан, Шербет',
          dinner: 'Жашылча шорпосу (300г), Манты эт, жашылча м-н (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Конфет, печенье (60г), Биокефир (200г)'
        }
      },
      {
        day: 'Ишемби',
        meals: {
          breakfast: 'Ашкабак кошулган таруу боткосу (200г), Плавленный сыр (90г), Сууга бышкан жумуртка (1 даана), Нан, каймак май, Сүт чайы',
          tea1: 'Пирог повидло менен (50г), Чай шекер менен (200г)',
          lunch: 'Тоок эти шорпосу (300г), Уй этинен куурдак (300г), "Освежающий" салаты, Нан, Шербет',
          dinner: 'Щи фасоль менен (300г), Дапанжи (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Ватрушка быштак менен (50г), Чай шекер менен (200г)'
        }
      },
      {
        day: 'Жекшемби',
        meals: {
          breakfast: 'Картошка сыр, жумуртка менен (150г), Каймак, Кыям, Нан, каймак май, Сүт чайы',
          tea1: 'Быштак печеньеси (50г), Чай шекер менен (200г)',
          lunch: 'Жумуртка кошулган шорпо (300г), Гуляш макарон менен (300г), "Оливье" салаты, Нан, Шербет',
          dinner: '"Чоң эне" шорпосу (300г), Ган-фан (300г), Жер-жемиш, Нан, Лимон чайы',
          tea2: 'Пирожки күрүч, жумуртка м-н (80г), Биокефир (200г)'
        }
      }
    ]
  ]
};

const getWeekIndexFromDate = (date) => Math.floor(date.getTime() / (1000 * 60 * 60 * 24 * 7)) % 2;

const getMealStatus = (currentTime) => {
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const currentMinutes = hour * 60 + minute;
  
  let currentMealIdx = -1;
  let nextMealIdx = -1;
  
  for (let i = 0; i < timeBlocks.length; i++) {
    if (currentMinutes >= timeBlocks[i].start && currentMinutes < timeBlocks[i].end) {
      currentMealIdx = i;
      break;
    }
  }

  if (currentMealIdx === -1) {
    for (let i = 0; i < timeBlocks.length; i++) {
      if (currentMinutes < timeBlocks[i].start) {
        nextMealIdx = i;
        break;
      }
    }
    if (nextMealIdx === -1) {
      nextMealIdx = 0;
    }
  }

  return { currentMealIdx, nextMealIdx, currentMinutes };
};

const getMealInfo = (dayMenu, mealIdx, lang) => {
  if (!dayMenu) return null;
  const keys = ['breakfast', 'tea1', 'lunch', 'dinner', 'tea2'];
  const key = keys[mealIdx];
  return {
    label: dayMenu.meals[key] || '',
    type: key
  };
};

const getCurrentMealCard = (weekIndex, dayIndex, mealIdx, lang) => {
  if (mealIdx === -1) return null;
  if (mealIdx === 0) {
    return { label: simpleMealSummary[lang][dayIndex].breakfast, type: 'breakfast' };
  }
  if (mealIdx === 2) {
    return { label: simpleMealSummary[lang][dayIndex].lunch, type: 'lunch' };
  }
  if (mealIdx === 3) {
    return { label: simpleMealSummary[lang][dayIndex].dinner, type: 'dinner' };
  }
  return getMealInfo(weeklyMenu[lang][weekIndex][dayIndex], mealIdx, lang);
};

const getNextMealInfo = (currentWeekIndex, currentDayIndex, nextMealIdx, lang, currentMinutes, currentTime) => {
  const afterLastMeal = currentMinutes >= timeBlocks[timeBlocks.length - 1].end;
  const nextDayIndex = afterLastMeal ? (currentDayIndex + 1) % 7 : currentDayIndex;
  const nextTime = afterLastMeal ? new Date(currentTime.getTime() + 24 * 60 * 60 * 1000) : currentTime;
  const nextWeekIndex = getWeekIndexFromDate(nextTime);
  const dayMenu = weeklyMenu[lang][nextWeekIndex][nextDayIndex];
  const mealInfo = getMealInfo(dayMenu, nextMealIdx, lang);
  return { ...mealInfo, dayIndex: nextDayIndex };
};

export default function App() {
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [accessLevel, setAccessLevel] = useState('user');
  const [editorClass, setEditorClass] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem('akyltool_class') || '';
  });
  const [selectedDuty, setSelectedDuty] = useState(() => {
    if (typeof window === 'undefined') return todayClass;
    return window.localStorage.getItem('akyltool_duty') || todayClass;
  });
  const [location, setLocation] = useState(() => {
    if (typeof window === 'undefined') return 'Point B';
    return window.localStorage.getItem('akyltool_location') || 'Point B';
  });
  const [classDutyAssignments, setClassDutyAssignments] = useState(() => {
    if (typeof window === 'undefined') return getEmptyAssignments();
    return loadAssignments();
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDutyOpen, setIsDutyOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('en');
  const [saved, setSaved] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMapFloor, setSelectedMapFloor] = useState(() => {
    if (typeof window === 'undefined') return '1';
    return loadMapState().selectedMapFloor;
  });
  const [mapPoints, setMapPoints] = useState(() => {
    if (typeof window === 'undefined') return { '1': null, '2': null, '3': null };
    return loadMapState().mapPoints;
  });
  const mapImageRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [firebaseConnected, setFirebaseConnected] = useState(false);
useEffect(() => {
    const syncData = async () => {
      const { data: nav } = await supabase.from('guest_navigation').select('*').single();
      if (nav) {
        setLocation(nav.location_name);
        setMapPoints(nav.map_points);
        setSelectedMapFloor(nav.selected_floor);
      }
      const { data: duties } = await supabase.from('duty_data').select('*').single();
      if (duties) setClassDutyAssignments(duties.assignments);
    };

    syncData();

    const channel = supabase.channel('sync-room')
      .on('postgres_changes', { event: '*', table: '*' }, () => syncData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);
  const persistLocal = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('akyltool_location', location);
      window.localStorage.setItem('akyltool_map_floor', selectedMapFloor);
      window.localStorage.setItem('akyltool_map_points', JSON.stringify(mapPoints));
      
      await supabase.from('guest_navigation').upsert({ 
        id: 1, 
        location_name: location, 
        map_points: mapPoints, 
        selected_floor: selectedMapFloor 
      });
    }
  };

  const persistAssignments = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('akyltool_duty_assignments', JSON.stringify(classDutyAssignments));
      await supabase.from('duty_data').upsert({ 
        id: 1, 
        assignments: classDutyAssignments 
      });
    }
  };
  

  

  const getAvailableStudents = (classKey, gender) => {
    const roster = classStudents[classKey]?.[gender] || [];
    const assigned = Object.values(classDutyAssignments[classKey]?.[gender] || {}).flat();
    return roster.filter(name => !assigned.includes(name));
  };

  const activeDutyClass = selectedDuty || todayClass;
  const todayAssignments = classDutyAssignments[activeDutyClass] || getEmptyAssignments()[activeDutyClass];
  const dutyTabLabels = {
    en: { map: 'Map', overview: 'Overview', duty: 'Duty Today', menu: 'Menu', boys: 'Boys', girls: 'Girls', noAssignments: 'No saved duty assignments yet for this class.' },
    kg: { map: 'Карта', overview: 'Башкы', duty: 'Дежурные', menu: 'Меню', boys: 'Окуучулар (балдар)', girls: 'Окуучулар (куйулар)', noAssignments: 'Бул класска азырынча дежурные дайындалган жок.' }
  };

  const menuWeekLabels = {
    en: ['Week 1', 'Week 2'],
    kg: ['1-апта', '2-апта']
  };

  const handleSelectStudent = (name, gender) => {
    setSelectedStudent({ name, gender });
  };

  const handleAssignStudent = (gender, slot) => {
    if (!selectedStudent || selectedStudent.gender !== gender || !editorClass) return;
    setClassDutyAssignments(prev => {
      const current = prev[editorClass] || { boys: { breakfast: [], tea1: [], lunch: [], dinner: [], tea2: [] }, girls: { breakfast: [], tea1: [], lunch: [], dinner: [], tea2: [] } };
      const next = {
        boys: { ...current.boys },
        girls: { ...current.girls }
      };

      const clean = { boys: {}, girls: {} };
      dutySlots.forEach(slotKey => {
        clean.boys[slotKey] = next.boys[slotKey].filter(student => student !== selectedStudent.name);
        clean.girls[slotKey] = next.girls[slotKey].filter(student => student !== selectedStudent.name);
      });

      clean[gender][slot] = [...clean[gender][slot], selectedStudent.name];

      return { ...prev, [editorClass]: clean };
    });
    setSelectedStudent(null);
  };

  const handleRemoveAssigned = (gender, slot, name) => {
    if (!editorClass) return;
    setClassDutyAssignments(prev => {
      const current = prev[editorClass] || { boys: { breakfast: [], tea1: [], lunch: [], dinner: [], tea2: [] }, girls: { breakfast: [], tea1: [], lunch: [], dinner: [], tea2: [] } };
      const nextGender = { ...current[gender], [slot]: current[gender][slot].filter(student => student !== name) };
      return { ...prev, [editorClass]: { ...current, [gender]: nextGender } };
    });
  };

  const handleMapClick = (event) => {
    if (accessLevel !== 'super') return;
    const img = mapImageRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    setMapPoints(prev => ({ ...prev, [selectedMapFloor]: { x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) } }));
  };

  const handleSelectMapFloor = (floor) => {
    setSelectedMapFloor(floor);
  };

  const handleClearMapPoint = () => {
    if (accessLevel !== 'super') return;
    setMapPoints(prev => ({ ...prev, [selectedMapFloor]: null }));
  };
  // Initialize data from Firebase on app load
  useEffect(() => {
    const initFirebaseData = async () => {
      try {
        const [storedDuty, storedLocation] = [
          window.localStorage.getItem('akyltool_duty'),
          window.localStorage.getItem('akyltool_location')
        ];
        const initialData = await getInitialData();

            if (!storedDuty && initialData?.dutyClass) {
          setSelectedDuty(initialData.dutyClass);
        }
        if (!storedLocation && initialData?.location) {
          setLocation(initialData.location);
        }
        if (!window.localStorage.getItem('akyltool_map_floor') && initialData?.mapState?.selectedMapFloor) {
          setSelectedMapFloor(initialData.mapState.selectedMapFloor);
        }
        if (!window.localStorage.getItem('akyltool_map_points') && initialData?.mapState?.mapPoints) {
          setMapPoints(initialData.mapState.mapPoints);
        }

        setFirebaseConnected(true);
      } catch (error) {
        console.error('Failed to load Firebase data:', error);
        // App will still work with default values
      }
    };
    
    initFirebaseData();
  }, []);

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    const unsubscribeDuty = subscribeToDutyClass((newDuty) => {
      if (typeof window !== 'undefined' && window.localStorage.getItem('akyltool_duty')) {
        return;
      }
      setSelectedDuty(newDuty);
    });

    const unsubscribeLocation = subscribeToLocation((newLocation) => {
      if (typeof window !== 'undefined' && window.localStorage.getItem('akyltool_location')) {
        return;
      }
      setLocation(newLocation);
    });

    const unsubscribeMapState = subscribeToMapState((newMapState) => {
      if (typeof window !== 'undefined' && window.localStorage.getItem('akyltool_map_floor')) {
        return;
      }
      if (newMapState?.selectedMapFloor) {
        setSelectedMapFloor(newMapState.selectedMapFloor);
      }
      if (newMapState?.mapPoints) {
        setMapPoints(newMapState.mapPoints);
      }
    });

    return () => {
      unsubscribeDuty();
      unsubscribeLocation();
      unsubscribeMapState();
    };
  }, []);

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem('akyltool_duty')) return;

    const updateAutoDuty = () => setSelectedDuty(getTodayClass());
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    let intervalId;

    const timeoutId = setTimeout(() => {
      updateAutoDuty();
      intervalId = setInterval(updateAutoDuty, 24 * 60 * 60 * 1000);
    }, msUntilMidnight + 50);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    persistAssignments();
  }, [classDutyAssignments]);

  // Cheat code authentication
  useEffect(() => {
    if (searchQuery === superAdminCode) {
      setAccessLevel('super');
      setEditorClass('');
      setSearchQuery("");
    } else if (editorCodes.includes(searchQuery)) {
      setAccessLevel('editor');
      setEditorClass(searchQuery);
      setSearchQuery("");
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('akyltool_class', searchQuery);
      }
    }
  }, [searchQuery]);

  // Handle save with Firebase sync
  const handleSave = async () => {
    try {
      persistLocal();
      await saveDutyClass(selectedDuty);
      await saveLocation(location);
      await saveMapState({ selectedMapFloor, mapPoints });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      persistLocal();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDutyChange = (value) => {
    setSelectedDuty(value);
    persistLocal();
  };

  const handleLocationConfirm = async (value) => {
    setLocation(value);
    persistLocal();
    await saveLocation(value);
  };
  const s = {
    bg: isDark ? '#000000' : '#ffffff',
    bgSecondary: isDark ? '#121212' : '#f3f4f6',
    card: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    cardHover: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    accent: accessLevel === 'super' ? '#3b82f6' : (accessLevel === 'editor' ? '#10b981' : '#fcd34d'),
    accentLight: accessLevel === 'super' ? (isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)') : (accessLevel === 'editor' ? (isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)') : (isDark ? 'rgba(252,211,77,0.12)' : 'rgba(252,211,77,0.08)')),
    text: isDark ? '#f8fafc' : '#000000',
    textSecondary: isDark ? '#a1a1aa' : '#6b7280',
    success: '#10b981'
  };

  const translations = {
    en: {
      dutyTitle: 'DUTY CLASS',
      locationTitle: 'LOCATION',
      scheduleTitle: 'MEAL SCHEDULE',
      currentMealTitle: 'Current Meal',
      nextMealTitle: 'Next Meal',
      lunchTime: 'LUNCH TIME',
      mainHall: 'Main Hall',
      save: 'Save Changes',
      saved: 'Saved!',
      enterCode: 'Enter code',
      now: 'Now',
      next: 'Next'
    },
    kg: {
      dutyTitle: 'НӨӨМӨТ КЛАССЫ',
      locationTitle: 'ЖЕРИ',
      scheduleTitle: 'ТАМАК РАСПИСАНИСИ',
      currentMealTitle: 'Азыркы тамак',
      nextMealTitle: 'Кийинки тамак',
      lunchTime: 'ТҮШКҮ ТАМАК',
      mainHall: 'Чоң Зал',
      save: 'Сохранить',
      saved: 'Сохранено!',
      enterCode: 'Код киргизиңиз',
      now: 'Азыр',
      next: 'Кийинки'
    }
  };

  const t = translations[lang];
  const currentDayIndex = (time.getDay() + 6) % 7;
  const currentWeekIndex = getWeekIndexFromDate(time);
  const { currentMealIdx, nextMealIdx, currentMinutes } = getMealStatus(time);
  const currentDayMenu = weeklyMenu[lang][currentWeekIndex][currentDayIndex];
  const currentMealInfo = currentMealIdx !== -1 ? getCurrentMealCard(currentWeekIndex, currentDayIndex, currentMealIdx, lang) : null;
  const nextMealInfo = currentMealIdx === -1 ? getNextMealInfo(currentWeekIndex, currentDayIndex, nextMealIdx, lang, currentMinutes, time) : null;
  const isMealActive = currentMealIdx !== -1;
  const currentClassAssignments = editorClass ? classDutyAssignments[editorClass] || getEmptyAssignments()[editorClass] : null;
  const availableBoys = editorClass ? getAvailableStudents(editorClass, 'boys') : [];
  const availableGirls = editorClass ? getAvailableStudents(editorClass, 'girls') : [];

  return (
    <div style={{ backgroundColor: s.bg, minHeight: '100vh', color: s.text, padding: '16px', fontFamily: 'system-ui, -apple-system, sans-serif', transition: 'background-color 0.3s', fontSize: '14px' }}>
      <style>{`
        @keyframes dutyModalOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dutyModalCardPop {
          from { opacity: 0; transform: translateY(18px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
        
        {/* TITLE */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0, color: '#ffffff', letterSpacing: '-0.5px' }}>AkylTool v1.32</h2>
          <p style={{ fontSize: '12px', fontWeight: '600', margin: '6px 0 0 0', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Navigation and Duty Management System</p>
        </div>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: `1px solid ${s.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="/Logo.png" 
              alt="Akyltool Logo" 
              style={{ width: '48px', height: '48px', objectFit: 'contain' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Akyltool</h1>
              {accessLevel !== 'user' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.accent }}></div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: s.textSecondary, opacity: 0.82, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {accessLevel === 'super' ? 'Super Admin' : 'Editor'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setIsDutyOpen(true)}
              title={lang === 'en' ? 'Open duty roster' : 'Аткаруу мениюн ачуу'}
              style={{ 
                background: s.card, 
                border: 'none', 
                color: s.text, 
                padding: '10px', 
                borderRadius: '12px', 
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.background = s.cardHover}
              onMouseLeave={(e) => e.target.style.background = s.card}
            >
              <Menu size={18} />
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              title={lang === 'en' ? 'Open menu' : 'Меню ачуу'}
              style={{ 
                background: s.card, 
                border: 'none', 
                color: s.text, 
                padding: '10px', 
                borderRadius: '12px', 
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.background = s.cardHover}
              onMouseLeave={(e) => e.target.style.background = s.card}
            >
              <Utensils size={18} />
            </button>
            <button 
              onClick={() => setLang(lang === 'en' ? 'kg' : 'en')} 
              title={lang === 'en' ? 'Switch to Kyrgyz' : 'Switch to English'}
              style={{ 
                background: s.card, 
                border: 'none', 
                color: s.text, 
                padding: '10px', 
                borderRadius: '12px', 
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.background = s.cardHover}
              onMouseLeave={(e) => e.target.style.background = s.card}
            >
              <Globe size={18} />
            </button>
            <button 
              onClick={() => setIsDark(!isDark)} 
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              style={{ 
                background: s.card, 
                border: 'none', 
                color: s.text, 
                padding: '10px', 
                borderRadius: '12px', 
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.target.style.background = s.cardHover}
              onMouseLeave={(e) => e.target.style.background = s.card}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['overview', 'duty', 'map', 'menu'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '14px 24px',
                  borderRadius: '999px',
                  border: `2px solid ${activeTab === tab ? s.accent : s.border}`,
                  background: activeTab === tab ? s.accentLight : s.card,
                  color: s.text,
                  fontWeight: activeTab === tab ? '700' : '600',
                  cursor: 'pointer',
                  fontSize: '15px',
                  transition: 'all 0.2s'
                }}
              >
                {dutyTabLabels[lang][tab]}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '13px', color: s.textSecondary }}>
            {activeTab === 'map'
              ? dutyTabLabels[lang].map
              : activeTab === 'duty'
                ? `${activeDutyClass} — ${dutyTabLabels[lang].duty}`
                : activeTab === 'menu'
                  ? dutyTabLabels[lang].menu
                  : dutyTabLabels[lang].overview}
          </div>
        </div>

        {activeTab === 'map' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: s.card, padding: '18px', borderRadius: '24px', border: `1px solid ${s.border}`, display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '860px', width: '100%', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: s.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Floor Map' : 'Карта кабата'}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '900', marginTop: '6px', color: s.text }}>
                    {mapFloorLabels[lang][Number(selectedMapFloor) - 1]}
                  </div>
                </div>
                {accessLevel === 'super' ? (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {['1', '2', '3'].map((floor) => (
                      <button
                        key={floor}
                        onClick={() => handleSelectMapFloor(floor)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '999px',
                          border: `1px solid ${selectedMapFloor === floor ? s.accent : s.border}`,
                          background: selectedMapFloor === floor ? s.accentLight : s.card,
                          color: s.text,
                          fontWeight: selectedMapFloor === floor ? '700' : '600',
                          cursor: 'pointer'
                        }}
                      >
                        {floor}
                      </button>
                    ))}
                    <button
                      onClick={handleClearMapPoint}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '999px',
                        border: `1px solid ${s.border}`,
                        background: s.bgSecondary,
                        color: s.text,
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {lang === 'en' ? 'Clear point' : 'Тазалоо'}
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: s.textSecondary }}>
                    {lang === 'en' ? 'View only. Contact admin for changes.' : 'Тек гана көрүү. Өзгөртүү үчүн админге кайрылыңыз.'}
                  </div>
                )}
              </div>
              <div style={{ position: 'relative', height: 'calc(100vh - 220px)', minHeight: '520px', maxHeight: '780px', maxWidth: '820px', width: '100%', borderRadius: '24px', overflow: 'hidden', background: s.bgSecondary, cursor: accessLevel === 'super' ? 'crosshair' : 'default', margin: '0 auto' }} onClick={handleMapClick}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    ref={mapImageRef}
                    src={mapFloorImages[selectedMapFloor]}
                    alt={`Floor ${selectedMapFloor} map`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                  />
                </div>
                {mapPoints[selectedMapFloor] && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${mapPoints[selectedMapFloor].x * 100}%`,
                      top: `${mapPoints[selectedMapFloor].y * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      border: '2px solid #fff',
                      boxShadow: '0 0 0 4px rgba(239,68,68,0.16)'
                    }}
                  />
                )}
              </div>
              <div style={{ fontSize: '13px', color: s.textSecondary }}>
                {accessLevel === 'super'
                  ? (lang === 'en' ? 'Click the map to place or move the point, then press Save Changes.' : 'Картаны чыкылдатып, чекитти коюңуз же жылдырыңыз, андан кийин Сактоо баскычын басыңыз.')
                  : mapPoints[selectedMapFloor]
                    ? (lang === 'en' ? 'Floor and point are shown from admin settings.' : 'Кабат жана чекит админдин орнотуусу боюнча көрсөтүлгөн.')
                    : (lang === 'en' ? 'No point set on this floor yet.' : 'Бул кабатта чекит коюлган жок.')}
              </div>
            </div>
          </div>
        ) : activeTab === 'overview' ? (
          <>
            {/* MAIN CONTENT GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              
              {/* DUTY CLASS CARD */}
          <div 
            style={{ 
              background: s.card, 
              padding: '20px', 
              borderRadius: '24px', 
              border: `2px solid ${accessLevel !== 'user' ? s.accent : s.border}`,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if(accessLevel !== 'user') e.currentTarget.style.background = s.cardHover; }}
            onMouseLeave={(e) => e.currentTarget.style.background = s.card}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Users size={20} color={s.accent} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: s.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.dutyTitle}</span>
            </div>
            {accessLevel !== 'user' ? (
              <select 
                value={selectedDuty} 
                onChange={(e) => handleDutyChange(e.target.value)} 
                style={{ 
                  background: s.accentLight, 
                  color: s.text, 
                  border: `1px solid ${s.accent}`, 
                  fontSize: '24px', 
                  fontWeight: '900', 
                  padding: '8px 12px',
                  borderRadius: '8px',
                  outline: 'none',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {dutyRotation.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <p style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>{selectedDuty}</p>
            )}
          </div>

          {/* LOCATION CARD */}
          <div 
            style={{ 
              background: s.card, 
              padding: '20px', 
              borderRadius: '24px', 
              border: `2px solid ${accessLevel === 'super' ? s.accent : s.border}`,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if(accessLevel === 'super') e.currentTarget.style.background = s.cardHover; }}
            onMouseLeave={(e) => e.currentTarget.style.background = s.card}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Map size={20} color={s.accent} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: s.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.locationTitle}</span>
            </div>
            {accessLevel === 'super' ? (
              <div>
                {editingLocation ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      autoFocus
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyPress={(e) => { if(e.key === 'Enter') { setEditingLocation(false); handleLocationConfirm(location); } }}
                      style={{ 
                        background: s.accentLight, 
                        color: s.text, 
                        border: `1px solid ${s.accent}`, 
                        padding: '8px 12px',
                        borderRadius: '8px',
                        outline: 'none',
                        flex: 1,
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    />
                    <button
                      onClick={() => { setEditingLocation(false); handleLocationConfirm(location); }}
                      style={{
                        background: s.accent,
                        color: '#fff',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '12px'
                      }}
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => setEditingLocation(true)}
                    style={{ 
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: s.accentLight,
                      fontSize: '24px', 
                      fontWeight: '900',
                      transition: 'all 0.2s',
                      border: `1px solid ${s.accent}`
                    }}
                  >
                    {location}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>{location}</p>
            )}
          </div>
        </div>

          {/* CURRENT MEAL CARD */}
          <div style={{ background: s.card, padding: '24px', borderRadius: '24px', border: `1px solid ${s.border}`, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: s.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isMealActive ? t.currentMealTitle : t.nextMealTitle}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '6px', color: isMealActive ? '#10b981' : s.text }}>
                {isMealActive ? currentMealInfo?.label : nextMealInfo?.label || '—'}
              </div>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '12px', background: isMealActive ? '#134e36' : '#3f3f46', color: '#fff', fontSize: '12px', fontWeight: '700' }}>
              {isMealActive ? t.now : t.next}
            </div>
          </div>
          </div>

          {/* 5 MEAL BLOCKS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '24px' }}>
          {timeBlocks.map((block, idx) => {
            const isCurrent = currentMealIdx === idx;
            const isNext = currentMealIdx === -1 && nextMealIdx === idx;
            const mealKey = block.key;
            return (
              <div key={mealKey} style={{
                background: isCurrent ? '#134e36' : isNext ? '#374151' : s.card,
                color: isCurrent ? '#fff' : s.text,
                padding: '12px',
                borderRadius: '16px',
                border: `1px solid ${isCurrent ? '#10b981' : s.border}`,
                textAlign: 'center',
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: isCurrent ? '#fff' : s.textSecondary, textTransform: 'uppercase', lineHeight: '1.2', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {mealLabels[lang][mealKey].name}
                </div>
                <div style={{ fontSize: '10px', fontWeight: '500', marginTop: '6px', color: isCurrent ? '#d1fae5' : s.textSecondary, lineHeight: '1.2' }}>
                  {mealLabels[lang][mealKey].time}
                </div>
              </div>
            );
          })}
          </div>
        </>) : activeTab === 'menu' ? (
          <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {weeklyMenu[lang].map((week, weekIdx) => (
                <div key={weekIdx} style={{ background: s.card, padding: '22px', borderRadius: '24px', border: `1px solid ${s.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '18px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: s.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {menuWeekLabels[lang][weekIdx]}
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: '800', marginTop: '6px', color: s.text }}>
                        {lang === 'en' ? `Week ${weekIdx + 1}` : `${weekIdx + 1}-апта`}
                      </div>
                    </div>
                    <div style={{ padding: '10px 14px', borderRadius: '12px', background: s.accentLight, color: s.text, fontSize: '12px', fontWeight: '700' }}>
                      {t.scheduleTitle}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '14px' }}>
                    {week.map((day) => (
                      <div key={day.day} style={{ background: s.accentLight, borderRadius: '18px', padding: '16px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: s.text, marginBottom: '10px' }}>{day.day}</div>
                        {Object.entries(day.meals).map(([mealKey, mealText]) => (
                          <div key={mealKey} style={{ marginBottom: '10px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '700', color: s.textSecondary, textTransform: 'uppercase', marginBottom: '4px' }}>
                              {mealLabels[lang][mealKey].name}
                            </div>
                            <div style={{ fontSize: '14px', color: s.text, lineHeight: '1.5' }}>{mealText}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: s.card, padding: '24px', borderRadius: '24px', border: `1px solid ${s.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: s.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {t.dutyTitle}
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: '800', marginTop: '6px', color: s.text }}>
                    {activeDutyClass}
                  </div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', background: s.accentLight, color: s.text, fontSize: '12px', fontWeight: '700' }}>
                  {t.dutyTitle}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px' }}>
                {dutySlots.map((slotKey) => (
                  <div key={slotKey} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: '20px', padding: '16px', minHeight: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ marginBottom: '12px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: s.textSecondary }}>
                        {mealLabels[lang][slotKey].name}
                      </div>
                      <div style={{ fontSize: '13px', color: s.textSecondary, marginBottom: '12px' }}>
                        {mealLabels[lang][slotKey].time}
                      </div>
                      <div style={{ padding: '12px', borderRadius: '18px', background: s.accentLight, minHeight: '110px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: s.text, marginBottom: '6px' }}>{dutyTabLabels[lang].boys}</div>
                        {todayAssignments.boys[slotKey]?.length ? todayAssignments.boys[slotKey].map((name) => (
                          <div key={name} style={{ fontSize: '14px', lineHeight: '1.4' }}>{name}</div>
                        )) : <div style={{ fontSize: '13px', color: s.textSecondary }}>—</div>}
                      </div>
                    </div>
                    <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: `1px solid ${s.border}` }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: s.text, marginBottom: '6px' }}>{dutyTabLabels[lang].girls}</div>
                      {todayAssignments.girls[slotKey]?.length ? todayAssignments.girls[slotKey].map((name) => (
                        <div key={name} style={{ fontSize: '14px', lineHeight: '1.4', paddingBottom: '4px' }}>{name}</div>
                      )) : <div style={{ fontSize: '13px', color: s.textSecondary }}>—</div>}
                    </div>
                  </div>
                ))}
              </div>
              {dutySlots.every((slotKey) => !todayAssignments.boys[slotKey]?.length && !todayAssignments.girls[slotKey]?.length) && (
                <div style={{ marginTop: '18px', color: s.textSecondary, fontSize: '14px' }}>
                  {dutyTabLabels[lang].noAssignments}
                </div>
              )}
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
            <div style={{ background: '#07101f', borderRadius: '24px', width: '100%', maxWidth: '1100px', maxHeight: '85vh', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  border: 'none',
                  background: s.card,
                  color: s.text,
                  borderRadius: '12px',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: s.textSecondary, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>{lang === 'en' ? 'Weekly menu' : 'Апта менюсу'}</div>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: s.text }}>{lang === 'en' ? 'Weekly Meal Plan' : 'Апта тамак планы'}</h2>
                </div>
              </div>
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(180px, 1fr))', gap: '12px' }}>
                  {weeklyMenu[lang][currentWeekIndex].map((day, dayIdx) => {
                    const isToday = dayIdx === currentDayIndex;
                    return (
                      <div key={day.day} style={{ background: s.bgSecondary, borderRadius: '18px', border: `2px solid ${isToday ? '#10b981' : s.border}`, padding: '16px', minHeight: '240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: isToday ? '#10b981' : s.text }}>{day.day}</div>
                        {['breakfast', 'tea1', 'lunch', 'dinner', 'tea2'].map((key, idx) => {
                          const mealLabel = day.meals[key];
                          const label = mealLabels[lang][key];
                          const labelText = typeof label === 'string' ? label : `${label.name} (${label.time})`;
                          const isActive = isToday && currentMealIdx === idx;
                          const isUpcoming = isToday && currentMealIdx === -1 && nextMealInfo?.type === key && nextMealInfo?.dayIndex === currentDayIndex;
                          return (
                            <div key={key} style={{
                              background: isActive ? '#134e36' : isUpcoming ? 'rgba(107,114,128,0.6)' : s.card,
                              color: isActive ? '#fff' : s.text,
                              opacity: isUpcoming ? 0.9 : 1,
                              borderRadius: '14px',
                              padding: '10px',
                              border: isActive ? '1px solid #10b981' : `1px solid ${s.border}`,
                              minHeight: '70px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.8, marginBottom: '8px', wordBreak: 'break-word' }}>{labelText}</div>
                              <div style={{ fontSize: '12px', lineHeight: '1.4', overflowWrap: 'anywhere' }}>{mealLabel}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {isDutyOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)', animation: 'dutyModalOverlayFade 240ms ease forwards' }}>
            <div style={{ background: '#07101f', borderRadius: '24px', width: '100%', maxWidth: '1100px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)', padding: '24px', position: 'relative', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', animation: 'dutyModalCardPop 240ms ease forwards' }}>
              <button
                onClick={() => { setIsDutyOpen(false); setSelectedStudent(null); }}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  border: 'none',
                  background: s.card,
                  color: s.text,
                  borderRadius: '12px',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ×
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: s.textSecondary, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>{lang === 'en' ? 'Duty roster' : 'Нөөмөт тизмеси'}</div>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: s.text }}>{editorClass ? `Class ${editorClass}` : (lang === 'en' ? 'Enter your class code' : 'Класс кодуңузду киргизиңиз')}</h2>
                </div>
                <div style={{ color: s.textSecondary, fontSize: '13px', lineHeight: '1.6' }}>
                  {accessLevel === 'editor' ? (lang === 'en' ? 'Select a student from the list and click a slot to assign them. Boys and girls are separate columns.' : 'Тизмеден окуучуну тандап, орунга чыкылдатып коюңуз. Жигиттер менен кыздар өзүнчө.' ) : (lang === 'en' ? 'Login with your class code to edit your roster.' : 'Өзүңүздүн класс кодуңуз менен кирип, тизмеңизди оңдоңуз.')}
                </div>
              </div>
              {accessLevel !== 'editor' || !editorClass ? (
                <div style={{ padding: '24px', borderRadius: '18px', background: s.card, color: s.text, textAlign: 'center' }}>
                  {lang === 'en' ? 'You need to login with a class code (for example 7A, 7B, 8A...) to access the duty roster.' : 'Класстын коду менен киришиңиз керек (мисалы 7A, 7B, 8A...) дежурства үчүн.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100% - 120px)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {dutySlots.map(slot => (
                        <div key={`boys-${slot}`} style={{ background: s.card, borderRadius: '18px', padding: '14px', minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `1px solid ${s.border}` }}>
                          <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: s.textSecondary, marginBottom: '8px' }}>{mealLabels[lang][slot].name}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {currentClassAssignments?.boys[slot]?.map(name => (
                              <button
                                key={name}
                                onClick={() => handleRemoveAssigned('boys', slot, name)}
                                style={{
                                  background: '#111827',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  borderRadius: '12px',
                                  color: '#fff',
                                  padding: '8px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                {name}
                              </button>
                            ))}
                            <button
                              onClick={() => handleAssignStudent('boys', slot)}
                              style={{
                                background: selectedStudent?.gender === 'boys' ? '#10b981' : '#374151',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '10px',
                                cursor: selectedStudent?.gender === 'boys' ? 'pointer' : 'not-allowed',
                                opacity: selectedStudent?.gender === 'boys' ? 1 : 0.7,
                                fontSize: '12px',
                                fontWeight: 700
                              }}
                              disabled={selectedStudent?.gender !== 'boys'}
                            >
                              {lang === 'en' ? 'Assign' : 'Тандоо'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {dutySlots.map(slot => (
                      <div key={`girls-${slot}`} style={{ background: s.card, borderRadius: '18px', padding: '14px', minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `1px solid ${s.border}` }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: s.textSecondary, marginBottom: '8px' }}>{mealLabels[lang][slot].name}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {currentClassAssignments?.girls[slot]?.map(name => (
                            <button
                              key={name}
                              onClick={() => handleRemoveAssigned('girls', slot, name)}
                              style={{
                                background: '#111827',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                color: '#fff',
                                padding: '8px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              {name}
                            </button>
                          ))}
                          <button
                            onClick={() => handleAssignStudent('girls', slot)}
                            style={{
                              background: selectedStudent?.gender === 'girls' ? '#10b981' : '#374151',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '10px',
                              cursor: selectedStudent?.gender === 'girls' ? 'pointer' : 'not-allowed',
                              opacity: selectedStudent?.gender === 'girls' ? 1 : 0.7,
                              fontSize: '12px',
                              fontWeight: 700
                            }}
                            disabled={selectedStudent?.gender !== 'girls'}
                          >
                            {lang === 'en' ? 'Assign' : 'Тандоо'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ background: s.card, borderRadius: '18px', padding: '16px', minHeight: '220px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: s.text }}>Boys</div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {availableBoys.map(name => (
                        <button
                          key={name}
                          onClick={() => handleSelectStudent(name, 'boys')}
                          style={{
                            background: selectedStudent?.name === name ? '#134e36' : '#111827',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            padding: '10px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: s.card, borderRadius: '18px', padding: '16px', minHeight: '220px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: s.text }}>Girls</div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {availableGirls.map(name => (
                        <button
                          key={name}
                          onClick={() => handleSelectStudent(name, 'girls')}
                          style={{
                            background: selectedStudent?.name === name ? '#134e36' : '#111827',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            padding: '10px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        )}
        {/* AUTHENTICATION SECTION */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            background: s.card, 
            padding: '12px 20px', 
            borderRadius: '20px', 
            gap: '12px',
            border: `1px solid ${s.border}`,
            transition: 'all 0.2s'
          }}>
            {accessLevel !== 'user' ? (
              <>
                <CheckCircle2 size={18} color={s.accent} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: s.textSecondary }}>
                  {accessLevel === 'super' ? 'Super Admin' : 'Editor'} Mode
                </span>
              </>
            ) : (
              <>
                <Lock size={18} color={s.textSecondary} />
                <input 
                  type="password" 
                  placeholder={t.enterCode}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  maxLength={4}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: s.text, 
                    width: '50px', 
                    outline: 'none', 
                    textAlign: 'center', 
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* SAVE BUTTON - SUPER ADMIN ONLY */}
        {accessLevel === 'super' && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <button
              onClick={handleSave}
              style={{
                background: saved ? s.success : s.accent,
                color: '#fff',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto',
                boxShadow: `0 4px 12px ${saved ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`
              }}
            >
              <Save size={18} />
              {saved ? 'SAVED TO MEMORY! ✅' : t.save}
            </button>
          </div>
        )}

        {/* CLOCK */}
        <footer style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', opacity: 0.3, fontSize: '12px', fontWeight: '500' }}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </footer>
      </div>
      <div style={{ 
  textAlign: 'center', 
  fontSize: '10px', 
  color: 'rgba(255, 255, 255, 0.3)', 
  marginTop: '10px', 
  marginBottom: '10px',
  fontFamily: 'sans-serif'
}}>
  CAS
</div>
{/* ЗАГОЛОВОК AKYLTOOL */}
<div style={{ 
  padding: '30px 20px 15px', 
  textAlign: 'left', 
  background: 'linear-gradient(to bottom, rgba(76, 175, 80, 0.15), transparent)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  marginBottom: '10px'
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <h1 style={{ 
      fontSize: '32px', 
      fontWeight: '900', 
      margin: 0, 
      color: '#fff', 
      letterSpacing: '-1px',
      textTransform: 'uppercase' 
    }}>
      Akyl<span style={{ color: '#4CAF50' }}>Tool</span>
    </h1>
    <span style={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      color: '#4CAF50', 
      padding: '3px 8px', 
      borderRadius: '4px', 
      fontSize: '11px', 
      fontWeight: 'bold',
      border: '1px solid rgba(76, 175, 80, 0.3)'
    }}>
      v1.32
    </span>
  </div>
  <p style={{ 
    fontSize: '13px', 
    color: 'rgba(255,255,255,0.5)', 
    marginTop: '6px', 
    fontWeight: '400',
    letterSpacing: '0.5px' 
  }}>
    Система управления навигацией и дежурством
  </p>
</div>
    </div>
  );
}