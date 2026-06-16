import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistercompanyComponent } from '../Register-LoginIn/registercompany/registercompany';
import { ChooseRole } from '../choose-role/choose-role';
import { Registerperson } from '../Register-LoginIn/registerperson/registerperson';
@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule,ChooseRole, RegistercompanyComponent, Registerperson],
  templateUrl: './candidates.html',
  styleUrls: ['./candidates.scss'],
})
export class CandidatesComponent {
 showChooseRole = false;
  showRegistration = false;
  showCompanyRegistration = false;
  steps = [
    {
      num: '01',
      title: 'შეავსე პროფილი',
      desc: 'გვიამბე გამოცდილების, ადგილმდებარეობისა და ხელმისაწვდომი დროის შესახებ. 5 წუთი სჭირდება.',
    },
    {
      num: '02',
      title: 'ჩვენ ვარჩევთ',
      desc: 'Personali-ი შეარჩევს შენთვის შესაფერის პოზიციას — გამოცდილება, ადგილი, გრაფიკი.',
    },
    {
      num: '03',
      title: 'გამოდი სამუშაოდ',
      desc: 'მარტივი onboarding, ნათელი პირობები. სამუშაოს პირველ დღეს ყველაფერი მზადაა.',
    },
    {
      num: '04',
      title: 'მიიღე ანაზღაურება',
      desc: 'Personali-ის მეშვეობით — პირდაპირ, გამჭვირვალედ, დროზე. არანაირი გაუგებრობა.',
    },
  ];

  compareOld = [
    'გრძელი CV გადახედვის პროცესი',
    'კვირები მოლოდინი — შედეგის გარეშე',
    'გაურკვეველი ანაზღაურების სქემა',
    'შენ უნდა მოძებნო სამუშაო',
    'ხელოვნური ინტერვიუები',
  ];

  compareNew = [
    'პროფილი ერთხელ — სამუშაო ყოველთვის',
    '24 საათში შეთავაზება',
    'გამჭვირვალე, შეთანხმებული ანაზღაურება',
    'Personali-ი ეძებს — შენ ირჩევ',
    'მხოლოდ რეალური, შემოწმებული კომპანიები',
  ];

  jobs = [
    { sector: '🛒', title: 'მოლარე / გამყიდველი', location: 'ვაკე', period: '2 კვირა', pay: '70₾', urgent: true },
    { sector: '☕', title: 'მიმტანი / ბარისტა', location: 'საბურთალო', period: '1 თვე', pay: '65₾', urgent: false },
    { sector: '📦', title: 'საწყობის ოპერატორი', location: 'გლდანი', period: '1 კვირა', pay: '75₾', urgent: true },
    { sector: '🏨', title: 'ადმინისტრატორი', location: 'ძველი თბილისი', period: '3 კვირა', pay: '80₾', urgent: false },
    { sector: '💊', title: 'ფარმაცევტის ასისტენტი', location: 'ისანი', period: '2 კვირა', pay: '70₾', urgent: false },
    { sector: '📞', title: 'ქოლ-ცენტრის ოპერატორი', location: 'დისტანციური', period: '1 თვე', pay: '55₾', urgent: false },
  ];

  testimonials = [
    {
      text: 'გამოიწვიეს, მითხრეს პირობები, მეორე დღეს უკვე ვმუშაობდი. ძალიან კომფორტული სისტემაა — არ გჭირდება ამა-იმ კარებზე კაკუნი.',
      name: 'გიორგი ლ.',
      role: 'კადრი — სასურსათო მაღაზია',
      initials: 'გ',
      color: '#1a7a4a',
    },
    {
      text: 'სტუდენტი ვარ და ძალიან მიხდება, რომ გრაფიკი თვითონ ვარჩევ. Personali-მა სემესტრის პარალელურად ანაზღაურება მაძლია.',
      name: 'ანი ც.',
      role: 'კადრი — კაფე',
      initials: 'ა',
      color: '#8b4a6b',
    },
    {
      text: 'პირველი სამუშაო ეს იყო ახალ ქალაქში. Personali-მა ყველაფერი ახსნა, თან ახლო სახლთან მიპოვა ადგილი. ძალიან კომფორტული.',
      name: 'ლევან კ.',
      role: 'კადრი — საწყობი',
      initials: 'ლ',
      color: '#2a5a8a',
    },
  ];

  sectors = [
    'ვაჭრობა / მაღაზია',
    'სერვისი / კვება',
    'საწყობი / ლოჯისტიკა',
    'სასტუმრო / ტურიზმი',
    'ფარმაცია / სამედიცინო',
    'ქოლ-ცენტრი',
    'სხვა',
  ];

  periods = ['1 კვირა', '2 კვირა', '1 თვე', '1 თვეზე მეტი'];

  registerPerks = [
    'რეგისტრაცია სრულიად უფასოა',
    '24 საათში პირდაპირ გიკავშირდებით',
    'შეთავაზებები შენ ადგილმდებარეობასთან ახლოს',
    'შენ გადაწყვეტ — მიიღებ თუ არ მიიღებ',
  ];

  formData = {
    name: '',
    phone: '',
    city: '',
    sector: '',
    period: '',
  };

  submitted = false;

  onSubmit() {
    this.submitted = true;
    // TODO: API call
    setTimeout(() => {
      this.formData = { name: '', phone: '', city: '', sector: '', period: '' };
    }, 4000);
  };
  onRoleSelected(role: 'company' | 'worker') {
    if (role === 'company') {
      this.showCompanyRegistration = true;
    } else {
      this.showRegistration = true;
    }
  }
}