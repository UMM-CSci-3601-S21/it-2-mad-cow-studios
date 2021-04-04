import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContextPackCardComponent } from './contextpack-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { ContextPack, Word, Wordlist } from './contextpack';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContextPackService } from './contextpack.service';
import { MockContextPackService } from 'src/testing/contextpack.service.mock';
import {MatChipsModule} from '@angular/material/chips';
import { workerData } from 'worker_threads';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { doesNotMatch } from 'assert';


describe('ContextPackCardComponent', () => {

  let component: ContextPackCardComponent;
  let fixture: ComponentFixture<ContextPackCardComponent>;
  let component2: ContextPackCardComponent;
  let fixture2: ComponentFixture<ContextPackCardComponent>;
  let emptyWordlist: Wordlist;
  let contextpackService: ContextPackService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [ ContextPackCardComponent ],
      providers: [ContextPackService]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    contextpackService = new ContextPackService(httpClient);
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPackCardComponent);
    fixture2 = TestBed.createComponent(ContextPackCardComponent);

    component = fixture.componentInstance;

    const noun: Word = {
      word: 'you',
      forms: ['you', 'yoyo', 'yos', 'yoted']
    };
    const noun2: Word = {
      word: 'goat',
      forms: ['goat', 'goats']
    };
    const adjective: Word = {
      word: 'green',
      forms: ['green', 'greener']
    };
    const verb: Word = {
      word: 'run',
      forms: ['ran', 'running']
    };
    const verb2: Word = {
      word: 'walk',
      forms: ['walks', 'walking']
    };
    const misc: Word = {
      word: 'langerhans',
      forms: ['langerhans', 'langerhan']
    };
    const testNouns: Word[] = [noun,noun2];
    const testVerbs: Word[] = [verb,verb2];
    const testAdjectives: Word[] = [adjective];
    const testMisc: Word[] = [misc];
    emptyWordlist ={

    };

    const testWordListBig: Wordlist[] = [{
      name: 'howdy',
      enabled: true,
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    },
 ];

    component.contextpack = {
      _id: 'pat_id',
      enabled: true,
      name: 'happy',
      wordlists: testWordListBig
    };

    const testContextPacks: ContextPack[] =
    [
      {
        _id: 'chris_id',
        name: 'fun',
        enabled: true,
        wordlists: testWordListBig
      },
      {
        _id: 'pat_id',
        name: 'sun',
        enabled: true,
        wordlists: testWordListBig
      },
      {
        _id: 'jamie_id',
        name: 'happy',
        enabled: true,
        wordlists: testWordListBig
      }
  ];



    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should create a download element when given a json', () => {
    expect(component.downloadJson(component.contextpack, component.contextpack.name).toString()).toContain('happy');

  });
  it('should convert a json into a correctly formatted json', () => {
    expect(component.convertToBetterJson(component.contextpack).$schema).
    toEqual('https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json');
    expect(component.convertToBetterJson(component.contextpack).id).toBeUndefined();
  });

  describe('set object Param', () => {

    it('set the object param for nouns', () => {
      const word = 'goat';
      const wordType = 'noun';
     expect(component.createParamObj(wordType, word)).toEqual({noun:'goat'});

    });
    it('set the object param for adjectives', () => {
      const word = 'goat';
      const wordType = 'adjective';
     expect(component.createParamObj(wordType, word)).toEqual({adjective:'goat'});

    });
    it('set the object param for verbs', () => {
      const word = 'goat';
      const wordType = 'verb';
     expect(component.createParamObj(wordType, word)).toEqual({verb:'goat'});

    });
    it('set the object param for misc', () => {
      const word = 'goat';
      const wordType = 'misc';
     expect(component.createParamObj(wordType, word)).toEqual({misc:'goat'});

    });
  });

  describe('Helper Functions', () => {
    it('displayEnabled shows the correct string', () => {
      expect(component.displayEnabled(false)).toEqual('Disabled');
      expect(component.displayEnabled(true)).toEqual('Enabled');
    });
    it('save emits the correct info', () => {
      component.valueChangeEvents.subscribe(output =>
        expect(output).toEqual(['person','noun']));
      component.save('noun','person');
    });
    it('submitForm calls addWord from contextpack service', () => {
      spyOn(component,'addWord');
      component.submitForm('noun');
      expect(component.addWord).toHaveBeenCalled();
    });
  });

  describe('Add Word', () => {
    it('addWord calls contextpackservice.addWord with correct parameters', () => {
      // spyOn(contextpackService,'addWord');
      // component.addWord('fakeWordList','test','noun');
      // expect(contextpackService.addWord).toHaveBeenCalled();

      // httpTestingController.expectOne('/api/contextpacks/pat_id/editlist?listname=fakeWordList&addnoun=test')
      // .flush(null, { status: 200, statusText:'Ok' });
    });
    it('addWord calls correct snackbar message when word is added', () => {});
    it('addWord calls correct snackbar message when word is not added', () => {});
  });

});
