import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Iamcompany } from '../Company and Person/iamcompany/iamcompany';
import { PersonalComponent } from '../Company and Person/personal-component/personal-component';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, Iamcompany, PersonalComponent, RouterLink],
  templateUrl: './how-it-works-component.html',
 styleUrls: ['./how-it-works-component.scss']
})
export class HowItWorksComponent {

    showIamcompany = false;        // ← ახალი
  showPersonalComponent = false;
  activeTab = signal<'companies' | 'workers'>('companies');

  setTab(tab: 'companies' | 'workers') {
    this.activeTab.set(tab);
  }

  // ── COMPANIES ──────────────────────────────────────────────
  companySteps = [
    {
      num: '01',
      icon: '📞',
      iconBg: 'rgba(46,204,114,0.12)',
      tag: 'პირველი ნაბიჯი',
      title: 'დაგვიკავშირდით',
      desc: 'გვიამბეთ: რა პოზიცია, რამდენ ხანს, სად. ჩვენი გუნდი 2 სთ-ში პასუხობს.',
      chips: ['📞 ზარი', '💬 WhatsApp', '📧 ელ-ფოსტა'],
    },
    {
      num: '02',
      icon: '🎯',
      iconBg: 'rgba(212,168,67,0.12)',
      tag: 'მეორე ნაბიჯი',
      title: 'ჩვენ ვარჩევთ',
      desc: '500+ კადრის ბაზიდან ვარჩევთ შესაფერისს — CV-ს გიგზავნით დასამტკიცებლად.',
      chips: ['CV სკრინინგი', 'გამოცდილება', 'ლოკაცია'],
    },
    {
      num: '03',
      icon: '✅',
      iconBg: 'rgba(15,28,20,0.07)',
      tag: 'მესამე ნაბიჯი',
      title: 'კადრი მუშაობს',
      desc: 'კანდიდატი გამოდის შეთანხმებულ დღეს. ანგარიშსწორება Personali-ის გავლით.',
      chips: ['24/7 მხარდაჭერა', 'ელ. ანგარიში', 'უკუკავშირი'],
    },
  ];

  timelineSegments = [
    { label: 'მოთხოვნა — 2სთ', width: '15%', color: '#2ecc72' },
    { label: 'სკრინინგი — 8სთ', width: '35%', color: '#1a9e54' },
    { label: 'დამტკიცება — 4სთ', width: '20%', color: '#d4a843' },
    { label: 'გამოსვლა',         width: '30%', color: '#0f1c14' },
  ];

  comparisonRows = [
    { icon: '⚡', feature: 'კადრის მოძებნის სიჩქარე', wl: '24 სთ-ში',       trad: '1–2 კვირა' },
    { icon: '💰', feature: 'ფასი',                    wl: 'გამჭვირვალე',    trad: 'ფარული გადასახ.' },
    { icon: '🔍', feature: 'სკრინინგი',               wl: 'CV + ზარი',      trad: 'მხოლოდ CV' },
    { icon: '📅', feature: 'ხელშეკრულების ვადა',      wl: '1 დღე – 1 თვე', trad: 'მინ. 3 თვე' },
    { icon: '🛡️', feature: 'გარანტია',               wl: 'ჩანაცვლება',     trad: 'არ არის' },
    { icon: '📞', feature: 'მხარდაჭერა',              wl: '24/7',           trad: 'სამუშაო საათები' },
    { icon: '🔄', feature: 'კანდიდატის შეცვლა',       wl: 'უფასო',          trad: 'ფასიანი' },
  ];

  sectorBars = [
    { name: 'სუპერმარკ.',  pct: '72%', color: '#2ecc72' },
    { name: 'რესტორნები', pct: '58%', color: '#1a9e54' },
    { name: 'საწყობები',  pct: '44%', color: '#d4a843' },
    { name: 'სასტუმრო',  pct: '38%', color: '#0f1c14' },
  ];

  sectors = [
    { icon: '🛒', name: 'სუპერმარკეტი', size: '128px', bg: 'rgba(46,204,114,0.1)',  border: 'rgba(46,204,114,0.35)', count: '38%' },
    { icon: '☕', name: 'კაფე & რესტ.', size: '108px', bg: 'rgba(212,168,67,0.1)', border: 'rgba(212,168,67,0.3)',  count: null  },
    { icon: '📦', name: 'საწყობი',       size: '98px',  bg: 'rgba(15,28,20,0.06)',  border: 'rgba(15,28,20,0.15)',  count: null  },
    { icon: '🏨', name: 'სასტუმრო',     size: '104px', bg: 'rgba(46,204,114,0.07)', border: 'rgba(46,204,114,0.2)', count: null  },
    { icon: '🏪', name: 'სავაჭრო ც.',   size: '94px',  bg: 'rgba(212,168,67,0.07)', border: 'rgba(212,168,67,0.2)', count: null  },
    { icon: '💊', name: 'აფთიაქი',      size: '86px',  bg: 'rgba(46,204,114,0.06)', border: 'rgba(46,204,114,0.15)',count: null  },
    { icon: '📞', name: 'ქოლ-ცენტრი',  size: '90px',  bg: 'rgba(15,28,20,0.05)',  border: 'rgba(15,28,20,0.1)',   count: null  },
    { icon: '✨', name: 'სხვა',          size: '78px',  bg: '#f0efe9',              border: '#e0dfd8',              count: null  },
  ];

  // ── WORKERS ────────────────────────────────────────────────
  workerSteps = [
    { num: '01', icon: '📋', title: 'პროფილის შევსება',    desc: 'CV, გამოცდილება, სასურველი სექტორი და გრაფიკი.',          time: '10 წუთი'        },
    { num: '02', icon: '🔍', title: 'სკრინინგი',           desc: 'Personali ამოწმებს პროფილს და საჭიროებისას გირეკავს.',      time: '24–48 სთ'       },
    { num: '03', icon: '🔔', title: 'შეთავაზება',          desc: 'SMS ან WhatsApp — სად, ანაზღაურება, ვადა. შენ გადაწყვეტ.', time: 'დაუყოვნებლივ'  },
    { num: '04', icon: '💰', title: 'ანაზღაურება',         desc: 'სამუშაოს შემდეგ — პირდაპირ Personali-ის მეშვეობით.',       time: 'სამუშ. ბოლოს'  },
  ];

  workerBenefits = [
    { icon: '⏱', label: 'შენი გრაფიკი'    },
    { icon: '💰', label: 'გამჭვ. ანაზ.'   },
    { icon: '🔒', label: 'სანდო კომპ.'    },
    { icon: '📈', label: 'CV-ს ზრდა'      },
    { icon: '🌍', label: 'მრავ. სექტ.'    },
    { icon: '🤝', label: '24/7 მხარდ.'   },
  ];

  // ── SHARED ──────────────────────────────────────────────────
  stats = [
    { num: '500+', label: 'დარეგისტრირებული კადრი', fill: '80%' },
    { num: '120+', label: 'პარტნიორი კომპანია',     fill: '65%' },
    { num: '24სთ', label: 'საშუალო რეაგირება',      fill: '92%' },
    { num: '98%',  label: 'კმაყოფილი პარტნიორი',   fill: '98%' },
  ];

  faqs = [
    { q: 'რამდენ ხანს სჭირდება კადრის პოვნა?',            a: 'საშუალოდ 24 საათი. გადაუდებელ შემთხვევებში — ზოგჯერ იმავე დღეს. ყველაფერი დამოკიდებულია პოზიციასა და ხელმისაწვდომ კანდიდატებზე.' },
    { q: 'შემიძლია კადრი გრძელვადიანად შევინარჩუნო?',     a: 'დიახ. სამუშაო პერიოდის შემდეგ კომპანია და კადრი შეიძლება პირდაპირ შეთანხმდნენ სრულ განაკვეთზე. Personali ამ პროცესს ხელს უწყობს.' },
    { q: 'კადრი კარგი არ აღმოჩნდა — რა ხდება?',           a: 'შეგვატყობინეთ. გარანტიის ფარგლებში სხვა კანდიდატს გამოვგზავნით. ჩვენი პრიორიტეტია შედეგი, არა მხოლოდ განთავსება.' },
    { q: 'კადრად დარეგისტრირება ფასიანია?',                a: 'არա. კადრებისთვის რეგისტრაცია სრულიаდ უფасოа. Personali კომპანიებისგаნ იღებს სакომისიოს.' },
    { q: 'როგორ ხდება ანგараშსწორებا?',                    a: 'სამუშаო პერიოდის ბოლოს Personali გიგზვნის ონვოისს. გდხდا хდებا سابانკو gadaricxvit.ყველფელի detali chiniastv shetanxmelia.' },]

  openFaqIndex: number | null = null;

  toggleFaq(i: number) {
    this.openFaqIndex = this.openFaqIndex === i ? null : i;
  }
}