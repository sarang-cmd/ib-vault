import json
import re
import os

raw_tables = """
### Category: Master Hubs & Repositories
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| pirateIB | https://pirateib.sh | Community hub linking to past papers, textbooks, question banks, exemplars | Free | 5 |
| pirateIB Repository | https://dl.pirateib.sh | File-browser access to the full repo | Free | 5 |
| pirateIB Repo ZIPs | https://dl.pirateib.sh/DOWNLOAD%20REPO%20-%20ZIPS/ | Downloadable ZIP archives of the whole repo | Free | 5 |
| pirateIB legacy mirror | https://pirateib.xyz | Alternate/backup mirror domain | Free | 3 |
| repo.pirateib.net | https://repo.pirateib.net | Legacy textbook/workbook/answer-book repo | Free | 4 |
| pirateIB Resource Guide | https://pirateib.sh/resguide/ | Master index of all pirateIB resources | Free | 5 |
| ibresources.cc | https://ibresources.cc | Clean categorized directory of IB tools and notes | Free | 5 |
| ibresources.cc Mirror List | https://ibresources.cc/mirrors2 | Live-updated list of repo mirrors when domains die | Free | 4 |
| IBDocs.re | https://ibdocs.re | Past-paper archive, strong for Maths HL | Free | 4 |
| RevisionDojo | https://revisiondojo.com | AI notes/question bank plus uni-prep tools | Freemium | 4 |
| Village (pirateIB) | https://village.pirateib.su | Community/collaboration space | Free | 4 |
| Hack Your Course IB Guide | https://www.hackyourcourse.com/ib-free-resources/ | Directory of 65+ resources with pros/cons per subject | Free | 4 |
| Ben's Maths IB Guide | https://papers.bensmaths.com/ib-guide | Reviewed comparison of 44+ Maths AA/AI resources | Free | 4 |
| Concordian Libguides | https://concordian-thailand.libguides.com | Past papers, study guides, worksheets, IA tips per subject | Free | 3 |
| iblieve.org | https://iblieve.org | General IB community/resource site | Free | 3 |
| theib2u.com | https://theib2u.com | Video explanations across subjects | Free | 3 |
| StudyIB Directory | https://www.studyib.com/ib/ | Reviews and links to dozens of IB tools | Free | 4 |

### Category: Past Papers & Question Banks
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| pirateIB Question Banks | https://dl.pirateib.sh/IB%20QUESTIONBANKS/ | Topic and paper-sorted question banks, v4-v6 | Free | 5 |
| Pestle (current) | https://pestle.pages.dev | Filterable topic question bank, community standard | Free | 5 |
| Pestle v4 | https://pestle-ib.firebaseapp.com | Legacy-syllabus topic question bank | Free | 3 |
| Pestle v3 | https://pestlev3.netlify.app | Intermediate backup version | Free | 3 |
| SaveMyExams Archive | https://smearchive.pages.dev | Free mirror of paid SaveMyExams notes/papers | Free | 5 |
| SaveMyExams Notes mirror | https://dl.pirateib.sh/SaveMyExams%20-%20Notes/ | Direct-download SME revision notes | Free | 4 |
| InThinking StudyIB mirror | https://dl.pirateib.sh/StudyIB/ | Free copy of paywalled StudyIB teacher content | Free | 4 |
| InThinking ThinkIB mirror | https://dl.pirateib.sh/ThinkIB/ | Free copy of paywalled ThinkIB teacher content | Free | 4 |
| Revision Town | https://revisiontown2024.pages.dev | Alternative notes/paper archive | Free | 3 |
| IGCSE.net Past Papers | https://igcse.net/free-ib-past-paper-download-2019-2020/ | Legacy IB past papers 1999-2018/2020 | Free | 3 |
| freeexampapers.com | https://freeexampapers.com/exam-papers/IB/ | Legacy paper archive 1999-2017 | Free | 3 |
| Chemistry legacy papers (Drive) | https://drive.google.com/drive/folders/1tI_eujDePcxI60511UNPFFZjU4x0rmc6 | Chemistry-specific 1999-2018 papers | Free | 3 |
| SmashingScience Chem Papers | https://www.smashingscience.org/ib-chemistry-hl-sl | Chemistry HL/SL paper collection | Free | 3 |
| ExamPapersPractice Maths AA HL | https://www.exampaperspractice.co.uk/ib-maths-aa-hl-topic-questions/ | Topic-sorted AA HL questions | Free | 4 |
| MarkScheme.app | https://markscheme.app/ib/past-papers/chemistry-hl | Legal free past papers and mark schemes | Free | 4 |
| PapersDaddy | https://www.papersdaddy.com/ib/score-calculator | 115,000+ free multi-board past papers | Free | 3 |
| Revision Village (free tier) | https://revisionvillage.com | Paid platform's free sample papers and videos | Freemium | 4 |

### Category: Mathematics AA HL
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| Christos Nikolaidis Practice Questions | https://www.christosnikolaidis.com/en/maa-exercise/ | Community-favorite exercise banks, formula booklets, Paper 3 specimens | Free | 5 |
| Maths Notes Drive Folder | https://drive.google.com/drive/folders/1qcZltzQ1mqebf2ZKNu1hkSIJxwAunYp9 | Community-shared complete notes folder | Free | 4 |
| Quester Maths AA Notes | https://quester.io/q/23787019/maths_aa | Structured topic notes | Free | 4 |
| Quester AA HL Paper 3 | https://quester.io/q/66622945/hl_paper_3 | Paper 3 investigation-style practice | Free | 4 |
| Addvance Maths | https://addvancemaths.com/ibaasl/ | Full revision site with companion YouTube channel | Free | 4 |
| ExamSolutions | https://www.examsolutions.net/international-exams/international-baccalaureate/ | Concept videos mapped to IB Maths topics | Free | 4 |
| ZNotes Mathematics | https://znotes.org | Community summary notes, all 4 Maths routes | Freemium | 4 |
| BlitzNotes Maths AA | https://www.blitznotes.org | Student-made AA-focused notes | Free | 3 |
| Aimnova Maths AA HL Notes | https://www.aimnova.app/ib-math-aa/notes-hl | HL-only calculus, complex numbers, vectors coverage | Free | 4 |
| Tutopiya Maths AA HL | https://www.tutopiya.com/learning-portal/resource/ib-dp/mathematics/aa-hl/aa | Notes, video, AI-marked quizzes | Freemium | 4 |
| ibtuition.sg Cheatsheets | https://ibtuition.sg/resources/ | 70 hand-built topic cheatsheets | Free | 4 |
| Desmos | https://www.desmos.com | Free graphing calculator for functions and Paper 3 | Free | 5 |
| GeoGebra | https://www.geogebra.org | Geometry/algebra visualizer for IA graphs | Free | 5 |
| Knowt Maths AA HL | https://knowt.com/exams/IB | Flashcards and AI study guides | Freemium | 3 |
| Revision Village YouTube | https://www.youtube.com/@revisionvillage-ibmathemat6191 | Free video walkthroughs of AA/AI topics | Free | 4 |
| Mitch Campbell YouTube | https://www.youtube.com/@OSC1990 | Cross-subject Maths and Physics video lessons | Free | 4 |
| Science Tutor YouTube | https://www.youtube.com/@theonlinesciencetutor2720 | Cross-subject Maths and Physics video lessons | Free | 4 |
| 3Blue1Brown | https://www.youtube.com/@3blue1brown | Conceptual/visual maths intuition | Free | 5 |

### Category: Physics HL
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| SaveMyExams Physics HL Notes | https://www.savemyexams.com/dp/physics/ib/23/hl/revision-notes/ | Concise official-style topic notes | Freemium | 5 |
| Quizlet Physics Textbook Solutions | https://quizlet.com/explanations/textbook-solutions/physics-for-the-ib-diploma-6th-edition-9781107628199 | Full worked answers to the standard HL textbook (Tsokos 6th Ed.) | Free | 5 |
| Mega Lecture Physics Notes | https://megalecture.com/ib-dp-physics-notes-worksheets/ | Free 2025-syllabus PDF booklets SL and HL | Free | 4 |
| IBPhysics.org | https://www.studyib.com/ib/resources/ibphysics | Comprehensive SL/HL revision notes | Free | 4 |
| Aimnova Physics HL Notes | https://www.aimnova.app/ib-notes | Full topic notes including HL extensions | Free | 4 |
| Tutopiya Physics HL | https://www.tutopiya.com/study-resources/ib-dp/physics-hl/ | Notes, AI-marked questions, past papers | Freemium | 4 |
| ibtuition.sg Physics Cheatsheets | https://ibtuition.sg/resources/ | 24 topic cheatsheets with GDC steps | Free | 4 |
| Isaac Physics | https://isaacphysics.org | University-style problems for HL-depth practice | Free | 4 |
| HyperPhysics | http://hyperphysics.phy-astr.gsu.edu | Concept maps for IA theory background | Free | 4 |
| PhET Simulations | https://phet.colorado.edu | Free physics simulations for IA data collection | Free | 5 |
| Chris Doner YouTube | https://www.youtube.com/@donerphysics | Physics topic videos | Free | 4 |
| Matt Anderson YouTube | https://www.youtube.com/@yoprofmatt | Physics topic videos | Free | 4 |
| Andy Masley YouTube | https://www.youtube.com/@AndyMasley | Physics SL-focused explainer videos | Free | 4 |
| Prof. Varun YouTube | https://www.youtube.com/@profvarun | Physics HL/SL past-paper question walkthroughs | Free | 4 |

### Category: Chemistry HL
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| Richard Thornley (IB Chem Vids) | https://www.youtube.com/@ibchemvids | Gold-standard HL/SL Chemistry video teaching | Free | 5 |
| MSJChem YouTube | https://www.youtube.com/@MSJChem | Short tutorial videos and free worksheets | Free ($10 full) | 4 |
| Elliot Brodie YouTube | https://www.youtube.com/@elliotbrodie | Chemistry topic videos | Free | 4 |
| ChemJungle YouTube | https://www.youtube.com/@ChemJungle | Chemistry topic videos | Free | 4 |
| Andrew Weng YouTube Playlists | https://www.youtube.com/user/theandrewvideos/playlists | Organized Chemistry playlists by topic | Free | 3 |
| Aimnova Chemistry HL Notes | https://www.aimnova.app/ib-chemistry/notes-hl | Full syllabus notes for first-exams-2025 | Free | 4 |
| Tutopiya Chemistry HL | https://www.tutopiya.com/study-resources/ib-dp/chemistry-hl/ | Notes, AI-marked quizzes, past papers | Freemium | 4 |
| ChemLibreTexts | https://chem.libretexts.org | Deep theory background for IA/EE research | Free | 4 |
| ChemGuide | https://www.chemguide.co.uk | Extremely clear explanations for tricky HL topics | Free | 5 |
| PhET Chemistry Sims | https://phet.colorado.edu | Titration and kinetics simulations for IA | Free | 5 |
| IB Chemistry Questionbank (Ellesmere) | https://sites.google.com/site/ibchemistryellesmerecollege/home | Topic-organized SL/HL question bank | Free | 3 |

### Category: Geography SL
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| Yambilla Geography Notes | https://yambilla.com | Teacher-made notes, core plus all 7 options | Free | 5 |
| ibgeographynotes.com | https://www.ibgeographynotes.com/unit-1-population-distribution | Unit-by-unit SL notes with vocab lists | Free | 5 |
| SamTheCamVet Notes | https://samthecamvet.wordpress.com/2020/07/30/free-ib-hl-sl-geography-notes/ | Free downloadable HL/SL notes | Free | 4 |
| IB Geography Pods | http://www.ibgeographypods.org | Podcast-style audio revision by topic | Free | 3 |
| Aimnova Geography Notes | https://www.aimnova.app/ib-notes | SL/HL core plus all 7 options | Free | 4 |
| Knowt Geography SL | https://knowt.com/exams/IB/IB-Geography-(SL) | Flashcards plus unit-by-unit study guides | Free | 4 |
| SaveMyExams Geography | https://www.savemyexams.com/dp/geography/ | Notes plus past-paper walkthroughs | Freemium | 4 |
| Our World in Data | https://ourworldindata.org | Case-study statistics for essays and IA | Free | 5 |
| World Bank Open Data | https://data.worldbank.org | Global datasets for Geography IA | Free | 5 |
| Eurostat | https://ec.europa.eu/eurostat/ | EU-specific statistics for Geography IA | Free | 5 |

### Category: English Lang&Lit SL
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| ibenglishguys.com | https://ibenglishguys.com | Full English A guide site | Free | 5 |
| IB English Guys YouTube | https://www.youtube.com/channel/UCEZHU9lVH7h2p60KI-rEbDA | Companion video channel | Free | 4 |
| Tim Nance (Nancenotes) YouTube | https://www.youtube.com/@Nancenotes | English Lit/Lang analysis videos | Free | 5 |
| ibyourwayout Lang&Lit SL | https://ibyourwayout.wordpress.com/english-a-language-literature-sl/ | Structured notes and essay guidance | Free | 4 |
| Mrs. Macfarland Non-Literary Analysis | https://www.mrsmacfarland.com/ll/non-literary-analysis | Paper 1 non-literary text-type breakdowns | Free | 4 |
| Webersown Lang&Lit Cheat Sheet | https://webersown.weebly.com/uploads/8/9/8/6/8986793/ib-langlit-cheat-sheet_paper_1.pdf | Paper 1 unseen-text cheat sheet | Free | 4 |
| BlitzNotes Eng Lang&Lit SL | https://www.blitznotes.org/ib/eng-langlit-sl | Continuously updated concept notes | Free | 4 |
| SaveMyExams Eng Lang&Lit SL | https://www.savemyexams.com/dp/english-language-and-literature/ib/english-a-language-and-literature/19/sl/revision-notes/ | Full revision notes | Freemium | 5 |
| RevisionDojo Eng Lang&Lit | https://www.revisiondojo.com/ib/ib-english-langlit-new | Notes, question bank, and model essays | Freemium | 5 |
| Aimnova Eng Lang&Lit Notes | https://www.aimnova.app/ib-notes | Paper 1/2 and IO worked models | Free | 4 |
| SparkNotes | https://www.sparknotes.com | Text summaries and analysis | Free | 4 |
| Poetry Foundation | https://www.poetryfoundation.org | Full poem texts with critical context | Free | 4 |

### Category: German Lang&Lit SL
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| Aimnova German Notes | https://www.aimnova.app/ib-notes | Notes and flashcards across 5 prescribed themes | Free | 4 |
| Deutsche Welle Deutsch Lernen | https://www.dw.com/de/deutsch-lernen/s-2055 | Graded articles and audio for oral prep | Free | 5 |
| Goethe-Institut Online Exercises | https://www.goethe.de/en/spr/ueb.html | Grammar and vocab practice by CEFR level | Free | 5 |
| Nachrichtenleicht (DLF) | https://www.nachrichtenleicht.de | Simplified German news for Paper 1 practice | Free | 5 |
| Linguee | https://www.linguee.com | Contextual translation dictionary for essays | Free | 5 |
| Duden Online | https://www.duden.de | Authoritative dictionary and grammar reference | Free | 5 |
| LEO Dictionary | https://dict.leo.org | Community-verified German-English translations | Free | 4 |

### Category: IA / EE / TOK Exemplars & Guides
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| Marxify | https://pirateib.sh/marxify/ | Free IA/EE/TOK exemplar bank | Free | 5 |
| pirateIB Official EE Exemplars | https://dl.pirateib.sh/IB%20OFFICIAL%20EE%20EXEMPLARS/ | Raw folder of official IB EE exemplars | Free | 5 |
| Clastify | https://www.clastify.com | Examiner-reviewed exemplars, IA/EE/TOK/RQ guides | Freemium | 5 |
| TOK Skills for Success PDF | https://drive.google.com/file/d/1sLO9OPbNMXwycqHR8wV9gC64WqRNomA0/view | Full TOK textbook PDF by John Sprague | Free | 5 |
| Cloudscore | https://www.thecloudscore.com | Video tutorials and exemplar papers | Freemium | 3 |

### Category: AI Study Tools
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| ExamDojo | https://app.examdojo.com | AI-marked practice questions, subject-mapped | Freemium | 4 |
| Cognity | https://app.cognity.com | AI tutoring with adaptive question sets | Freemium | 4 |
| Perplexity | https://www.perplexity.ai | Research assistant for EE/IA source-checking | Freemium | 5 |
| Aimnova | https://www.aimnova.app | Free AI-aligned notes across most DP subjects | Free | 5 |
| Tutopiya | https://www.tutopiya.com | AI-marked quizzes, notes, grade predictor | Freemium | 4 |
| Knowt | https://knowt.com | AI flashcard and study-guide generator | Freemium | 4 |
| NotebookLM | https://notebooklm.google.com | Upload PDFs for AI Q&A and audio summaries | Free | 5 |
| Grammarly | https://www.grammarly.com | Grammar and clarity checker for EE/IA/TOK drafts | Freemium | 4 |
| QuillBot | https://quillbot.com | Paraphrasing and citation generator | Freemium | 3 |

### Category: Grade & Score Calculators
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| IBPredict.org | https://ibpredict.org | Predicted score calculator with session/timezone selector | Free | 5 |
| IB45 (GitHub) | https://github.com/AppleEpic101/IB45 | Open-source predicted-score tool with probability graphs | Free | 4 |
| IBcalculator.com | https://www.ibcalculator.com | Grade calculator using official boundaries 2019-present | Free | 4 |
| ibcalc.com | https://www.ibcalc.com | Score calculator with AI university-advice add-on | Free | 4 |
| Clastify Grade Calculators | https://www.clastify.com/ib-grade-calculator/tok | Per-subject estimator using historical boundaries | Free | 4 |
| Tutopiya Grade Predictor | https://www.tutopiya.com/tools/grade-predictor/ | Per-paper mark entry to predicted grade | Free | 4 |

### Category: Flashcards & Active Recall
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| Knowt | https://knowt.com | Millions of flashcard sets and AI study guides | Freemium | 5 |
| Anki | https://apps.ankiweb.net | Spaced-repetition flashcards with shared IB decks | Free | 5 |
| Quizlet | https://quizlet.com | Flashcards, quizzes, and textbook solution sets | Freemium | 4 |

### Category: YouTube Channels
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| Richard Thornley (IB Chem Vids) | https://www.youtube.com/@ibchemvids | Chemistry video teaching | Free | 5 |
| MSJChem | https://www.youtube.com/@MSJChem | Chemistry tutorials | Free | 4 |
| Elliot Brodie | https://www.youtube.com/@elliotbrodie | Chemistry videos | Free | 4 |
| ChemJungle | https://www.youtube.com/@ChemJungle | Chemistry videos | Free | 4 |
| Chris Doner | https://www.youtube.com/@donerphysics | Physics videos | Free | 4 |
| Matt Anderson | https://www.youtube.com/@yoprofmatt | Physics videos | Free | 4 |
| Andy Masley | https://www.youtube.com/@AndyMasley | Physics SL videos | Free | 4 |
| Prof. Varun | https://www.youtube.com/@profvarun | Physics walkthroughs | Free | 4 |
| Science Tutor | https://www.youtube.com/@theonlinesciencetutor2720 | Maths and Physics | Free | 4 |
| Mitch Campbell | https://www.youtube.com/@OSC1990 | Maths and Physics | Free | 4 |
| Revision Village | https://www.youtube.com/@revisionvillage-ibmathemat6191 | Maths videos | Free | 4 |
| 3Blue1Brown | https://www.youtube.com/@3blue1brown | Maths/Physics conceptual | Free | 5 |
| Tim Nance | https://www.youtube.com/@Nancenotes | English Lit/Lang | Free | 5 |
| IB English Guys | https://www.youtube.com/channel/UCEZHU9lVH7h2p60KI-rEbDA | English A | Free | 4 |
| Crash Course | https://www.youtube.com/@crashcourse | Cross-subject primers | Free | 4 |
| IB Like Cole | https://www.youtube.com/@iblikecole9167 | General IB tips/advice | Free | 4 |

### Category: Communities
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| r/IBO | https://www.reddit.com/r/IBO | Main IB subreddit with FAQ wiki and megathreads | Free | 5 |
| iblieve.org | https://iblieve.org | General IB community hub | Free | 3 |
| pirateIB Telegram | https://telegram.pirateib.sh | Announcements and resource sharing | Free | 4 |
| pirateIB Instagram | https://instagram.pirateib.sh | Announcements and resource sharing | Free | 3 |

### Category: Document & Paywall Access
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| Anna's Archive | https://annas-archive.org | Book and paper mirror aggregator | Free | 4 |
| LibGen | https://libgen.bz | Textbook and ebook mirror | Free | 4 |
| Sci-Hub | https://sci-hub.ru | Academic paper access for EE citations | Free | 3 |
| Scribd Downloader | https://scribd.vdownloaders.com | Unlock Scribd documents | Free | 3 |
| Studocu Downloader | https://www.downstudocu.net | Unlock Studocu documents | Free | 3 |
| Issuu Downloader | https://issuu-downloader.com | Unlock Issuu documents | Free | 3 |

### Category: Textbooks & eBooks
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| pirateIB Textbooks folder | https://dl.pirateib.sh | Full IB-authorized textbook PDFs, all groups | Free | 5 |
| ScienceKnowledge IB Textbooks | https://scienceknowledge.webador.com/ib-textbooks | Physics/Chemistry coursebook PDFs | Free | 4 |
| chemistry.com.pk | https://chemistry.com.pk/books/chemistry-for-the-ib-diploma-2e-christopher-talbot/ | Chemistry for the IB Diploma free download | Free | 4 |
| Official Textbook List PDF | https://isob.ukw.edu.pl/wp-content/uploads/2021/06/textbooks-for-the-ib-diploma-programme-2021-2023.pdf | Official ISBN/edition reference across subjects | Free | 4 |

### Category: Databases & Research
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| Google Scholar | https://scholar.google.com | Peer-reviewed sources for EE/IA citations | Free | 5 |
| Zotero | https://www.zotero.org | Free citation manager for EE bibliography | Free | 5 |
| MyBib | https://www.mybib.com | Citation generator for all referencing styles | Free | 5 |
| Scribbr Citation Generator | https://www.scribbr.com/citation/generator/cite/ | Alternative citation generator | Free | 4 |

### Category: University Application & Prep
| Name | URL | Description | Cost | Rank |
|---|---|---|---|---|
| edX | https://www.edx.org | Free university-level courses with certificates | Freemium | 5 |
| Common App | https://www.commonapp.org | US university applications | Free | 5 |
| UCAS | https://www.ucas.com | UK university applications | Free | 5 |
| College Confidential | https://www.collegeconfidential.com | US-focused student Q&A community | Free | 4 |
| The Student Room | https://www.thestudentroom.co.uk | UK-focused student Q&A community | Free | 4 |
"""

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

categories = []
resources = []

# Select some recent resources to flag as is_new
new_slugs = {
    'notebooklm', 'examdojo', 'aimnova', 'aimnova-maths-aa-hl-notes', 
    'markscheme-app', 'quester-aa-hl-paper-3', 'pestle-current'
}

recent_dates = {
    'notebooklm': '2025-02-18',
    'examdojo': '2025-02-14',
    'aimnova': '2025-02-10',
    'aimnova-maths-aa-hl-notes': '2025-02-05',
    'markscheme-app': '2025-01-29',
    'quester-aa-hl-paper-3': '2025-01-22',
    'pestle-current': '2025-01-15'
}

current_cat = None
lines = raw_tables.strip().split('\n')
for line in lines:
    line = line.strip()
    if line.startswith('### Category:'):
        current_cat = line.replace('### Category:', '').strip()
        if current_cat not in categories:
            categories.append(current_cat)
    elif line.startswith('|') and not line.startswith('|---') and not 'URL' in line:
        parts = [p.strip() for p in line.split('|')]
        # Parts will have leading & trailing empty strings because line starts and ends with |
        parts = [p for p in parts if p != '']
        if len(parts) >= 5:
            name, url, desc, cost, rank_str = parts[0], parts[1], parts[2], parts[3], parts[4]
            try:
                rank = int(re.search(r'\d+', rank_str).group())
            except:
                rank = 3
            
            slug = slugify(f"{name}-{current_cat}")
            base_slug = slugify(name)
            is_new = base_slug in new_slugs
            added_date = recent_dates.get(base_slug, '2024-11-10')
            
            resources.append({
                "id": slug,
                "name": name,
                "url": url,
                "description": desc,
                "category": current_cat,
                "cost": "Freemium" if "Freemium" in cost else "Free",
                "rank": rank,
                "is_new": is_new,
                "added_date": added_date,
                "status": "approved"
            })

os.makedirs('src/data', exist_ok=True)
os.makedirs('supabase/migrations', exist_ok=True)

# Save JSON seed
with open('src/data/resources.json', 'w', encoding='utf-8') as f:
    json.dump(resources, f, indent=2, ensure_ascii=False)

# Save TS dataset
ts_content = f"""// Generated by scripts/parse_resources.py
export interface Resource {{
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  cost: 'Free' | 'Freemium';
  rank: number;
  is_new: boolean;
  added_date?: string;
  status: 'approved' | 'pending' | 'broken';
}}

export const CATEGORIES: string[] = {json.dumps(categories, indent=2)};

export const INITIAL_RESOURCES: Resource[] = {json.dumps(resources, indent=2)};
"""
with open('src/data/resources.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

# Generate Supabase SQL migration
sql_lines = [
    "-- Supabase SQL Migration: 01_resources.sql",
    "-- Create resources table for IB Vault",
    "CREATE TABLE IF NOT EXISTS public.resources (",
    "  id TEXT PRIMARY KEY,",
    "  name TEXT NOT NULL,",
    "  url TEXT NOT NULL,",
    "  description TEXT NOT NULL,",
    "  category TEXT NOT NULL,",
    "  cost TEXT NOT NULL CHECK (cost IN ('Free', 'Freemium')),",
    "  rank INTEGER NOT NULL DEFAULT 3 CHECK (rank BETWEEN 1 AND 5),",
    "  is_new BOOLEAN NOT NULL DEFAULT false,",
    "  added_date DATE NOT NULL DEFAULT CURRENT_DATE,",
    "  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'broken')),",
    "  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL",
    ");",
    "",
    "-- Enable Row Level Security (RLS)",
    "ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;",
    "",
    "-- Allow anonymous read for approved resources",
    "CREATE POLICY \"Allow public read approved\" ON public.resources",
    "  FOR SELECT USING (status = 'approved');",
    "",
    "-- Allow anonymous submission with pending status",
    "CREATE POLICY \"Allow public insert pending\" ON public.resources",
    "  FOR INSERT WITH CHECK (status = 'pending');",
    "",
    "-- Allow admin full access",
    "CREATE POLICY \"Allow full admin access\" ON public.resources",
    "  FOR ALL USING (auth.role() = 'authenticated');",
    "",
    "-- Seed data insertion",
    "INSERT INTO public.resources (id, name, url, description, category, cost, rank, is_new, added_date, status) VALUES"
]

val_rows = []
for r in resources:
    # Escape single quotes in strings
    name_esc = r['name'].replace("'", "''")
    url_esc = r['url'].replace("'", "''")
    desc_esc = r['description'].replace("'", "''")
    cat_esc = r['category'].replace("'", "''")
    cost_esc = r['cost']
    rank_val = r['rank']
    is_new_val = 'TRUE' if r['is_new'] else 'FALSE'
    date_val = r.get('added_date', '2024-11-10')
    val_rows.append(f"  ('{r['id']}', '{name_esc}', '{url_esc}', '{desc_esc}', '{cat_esc}', '{cost_esc}', {rank_val}, {is_new_val}, '{date_val}', 'approved')")

sql_lines.append(",\n".join(val_rows) + "\nON CONFLICT (id) DO NOTHING;")

with open('supabase/migrations/01_resources.sql', 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

print(f"Parsed {len(resources)} resources across {len(categories)} categories.")
