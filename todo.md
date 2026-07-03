# AI Research Partner - Project TODO

## Phase 1: Core Infrastructure & Setup

- [x] Generate custom app logo and update app.config.ts with branding
- [x] Set up API keys for research sources (IEEE, Springer, Google Scholar, Perplexity)
- [x] Configure Manus LLM integration for multi-perspective analysis
- [ ] Set up voice transcription service (expo-speech)
- [x] Configure database schema for saved papers and collections

## Phase 2: Frontend - Basic Screens

- [x] Create Home Screen with quick search and recent queries
- [x] Create Search Screen with text/voice input and source selection
- [ ] Create Research Results screen with paper cards and pagination
- [ ] Create Paper Detail screen with tabs (Overview, Insights, Citations)
- [ ] Create Saved Research screen with collections management
- [ ] Create Settings screen with preferences and API configuration
- [ ] Implement tab navigation between Home, Search, Saved, Settings

## Phase 3: Voice & Search Integration

- [ ] Implement voice recording with expo-audio
- [ ] Integrate speech-to-text transcription
- [ ] Create voice input UI with waveform visualization
- [x] Implement text search with debouncing
- [x] Add source selection toggles (IEEE, Springer, Google Scholar, Web)
- [x] Create advanced filter UI (date range, domain, paper type)

## Phase 4: Research API Integration

- [ ] Integrate IEEE Xplore API for paper search
- [ ] Integrate Springer API for paper search
- [x] Integrate Google Scholar scraping/API for paper search
- [x] Integrate Perplexity or general web search API
- [x] Create unified search results aggregator
- [ ] Implement result pagination and caching
- [x] Add error handling for API failures

## Phase 5: AI Analysis & Synthesis

- [x] Implement multi-perspective analysis using Claude/GPT models
- [ ] Create analysis screen with key themes extraction
- [x] Add contrasting views identification
- [x] Implement research gaps detection
- [x] Add recommendations generation
- [ ] Create comparison view for multiple papers
- [x] Implement source attribution in analysis results

## Phase 6: Data Management & Persistence

- [x] Implement save/bookmark functionality for papers
- [x] Create collection management (create, rename, delete)
- [ ] Set up AsyncStorage for local persistence
- [ ] Implement export functionality (BibTeX, RIS, PDF)
- [ ] Add citation formatting options
- [ ] Create bulk export for collections
- [x] Implement search history persistence

## Phase 7: UI/UX Polish & Interactions

- [ ] Add haptic feedback for button presses
- [ ] Implement loading states with skeleton loaders
- [ ] Add empty state illustrations and messages
- [ ] Implement error handling UI with retry options
- [ ] Add toast notifications for user feedback
- [ ] Implement dark mode support
- [ ] Add smooth transitions and animations
- [ ] Optimize performance for large result lists

## Phase 8: Testing & Refinement

- [ ] Test voice input on iOS and Android
- [ ] Test API integrations with real queries
- [ ] Test paper saving and collection management
- [ ] Test export functionality
- [ ] Test dark mode across all screens
- [ ] Performance testing with large datasets
- [ ] User flow testing end-to-end
- [ ] Fix bugs and edge cases

## Phase 9: Branding & Deployment

- [ ] Generate app logo and update assets
- [ ] Update app.config.ts with final branding
- [ ] Create app store metadata and descriptions
- [ ] Prepare for iOS and Android builds
- [ ] Create documentation for users
- [ ] Final QA and testing

---

## Notes

- Voice commands should be always accessible from any screen
- Research sources can be toggled on/off based on user preference
- API keys should be stored securely in environment variables
- All paper data should include proper attribution to source
- Export formats should support standard citation managers
