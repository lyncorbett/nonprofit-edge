#!/usr/bin/env python3
f = open('src/components/Dashboard.tsx','r').read()

old_modal = """            {/* Content */}
            <div className="p-5 lg:p-6">
              <p className="text-slate-600 mb-5 leading-relaxed text-sm lg:text-base">
                {selectedTool.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  What's Included
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {selectedTool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-[#0097A9] flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm lg:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartTool}
                  className="flex-1 px-4 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm lg:text-base"
                >
                  <Play className="w-4 h-4" />
                  Start Tool
                </button>
              </div>
            </div>"""

new_modal = '''            {/* Content - Step 1 */}
            {modalStep === 1 && (
            <div className="p-5 lg:p-6">
              <p className="text-slate-600 mb-5 leading-relaxed text-sm lg:text-base">
                {selectedTool.description}
              </p>
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  {selectedTool.id === 'leadership-profile' || selectedTool.id === 'ceo-board' ? "What's Available" : "What's Included"}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {selectedTool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-[#0097A9] flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm lg:text-base">Cancel</button>
                <button onClick={handleStartTool} className="flex-1 px-4 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm lg:text-base">
                  <Play className="w-4 h-4" />
                  Start Tool
                </button>
              </div>
            </div>
            )}

            {/* Step 2: Leadership Profile */}
            {modalStep === 2 && selectedTool.id === 'leadership-profile' && (
            <div className="p-5 lg:p-6">
              <div className="bg-[#0D2C54] -mx-5 -mt-5 lg:-mx-6 lg:-mt-6 px-6 py-5 mb-5">
                <div style={{fontSize:'10px',fontWeight:700,color:'#0097A9',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'4px'}}>Edge Leadership Profile\u2122</div>
                <h2 className="text-lg font-extrabold text-white">Who is this assessment for?</h2>
              </div>
              {[
                {id:'self',icon:'\U0001f464',title:'Assess Myself',desc:'Rate yourself on all 48 questions. Get your full report with scores, insights, and growth plan.'},
                {id:'staff',icon:'\U0001f465',title:'Assess a Team Member',desc:'Rate a direct report. They get a development report. You get a coaching guide for the conversation.'},
                {id:'180',icon:'\U0001f504',title:'180\u00b0 Assessment',desc:'You assess an employee and they assess themselves. Both get a combined report with a conversation guide.'},
              ].map((mode) => (
                <button key={mode.id} onClick={() => setLpMode(mode.id)}
                  className="w-full flex items-start gap-3 p-4 mb-2 border-2 rounded-xl text-left transition-all"
                  style={{borderColor: lpMode===mode.id ? '#0097A9' : '#e2e8f0', background: lpMode===mode.id ? 'rgba(0,151,169,0.05)' : '#fff'}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{background: lpMode===mode.id ? '#0097A9' : '#f1f5f9'}}>{mode.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#0D2C54]">{mode.title}</div>
                    <div className="text-xs text-slate-500 leading-snug mt-0.5">{mode.desc}</div>
                  </div>
                  <div className="w-5 h-5 rounded-full flex-shrink-0 mt-1.5 transition-all" style={{border: lpMode===mode.id ? '6px solid #0097A9' : '2px solid #cbd5e1'}} />
                </button>
              ))}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModalStep(1)} className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">\u2190 Back</button>
                <button onClick={handleStartTool} className="flex-1 px-4 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium text-sm transition-colors">
                  {lpMode === 'self' ? 'Start Assessment \u2192' : 'Start & Send Invitation \u2192'}
                </button>
              </div>
            </div>
            )}

            {/* Step 2: CEO & Board */}
            {modalStep === 2 && selectedTool.id === 'ceo-board' && (
            <div className="p-5 lg:p-6">
              <div className="bg-[#0D2C54] -mx-5 -mt-5 lg:-mx-6 lg:-mt-6 px-6 py-5 mb-5">
                <div style={{fontSize:'10px',fontWeight:700,color:'#0097A9',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:'4px'}}>CEO & Board Assessments</div>
                <h2 className="text-lg font-extrabold text-white">What would you like to do?</h2>
              </div>
              {[
                {id:'ceo-self',icon:'\U0001f464',title:'CEO Self-Assessment',desc:'Reflect on your executive leadership privately. Covers board relationship, strategic positioning, organizational health, and succession readiness. ~10 min.',badge:''},
                {id:'board',icon:'\U0001f4cb',title:'Board Assessment',desc:'Evaluate board effectiveness across governance, strategy, fundraising, and oversight. Sent to all board members. CEO participation is optional. Responses aggregated anonymously.',badge:''},
                {id:'eval',icon:'\U0001f4ca',title:'CEO Evaluation',desc:'Board members evaluate the CEO anonymously. CEO self-assessment is optional. Both sides receive a combined report with a structured meeting agenda.',badge:'Board \u2192 CEO \u00b7 Responses aggregated anonymously'},
              ].map((path) => (
                <button key={path.id} onClick={() => setCbMode(path.id)}
                  className="w-full flex items-start gap-3 p-4 mb-2 border-2 rounded-xl text-left transition-all"
                  style={{borderColor: cbMode===path.id ? '#0097A9' : '#e2e8f0', background: cbMode===path.id ? 'rgba(0,151,169,0.05)' : '#fff'}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{background: cbMode===path.id ? '#0097A9' : '#f1f5f9'}}>{path.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#0D2C54]">{path.title}</div>
                    <div className="text-xs text-slate-500 leading-snug mt-0.5">{path.desc}</div>
                    {path.badge && <div className="inline-block mt-1.5 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-semibold rounded">{path.badge}</div>}
                  </div>
                  <div className="w-5 h-5 rounded-full flex-shrink-0 mt-1.5 transition-all" style={{border: cbMode===path.id ? '6px solid #0097A9' : '2px solid #cbd5e1'}} />
                </button>
              ))}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setModalStep(1)} className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">\u2190 Back</button>
                <button onClick={handleStartTool} className="flex-1 px-4 py-3 bg-[#0097A9] hover:bg-[#007f8f] text-white rounded-lg font-medium text-sm transition-colors">
                  {cbMode === 'ceo-self' ? 'Start Self-Assessment \u2192' : cbMode === 'board' ? 'Send to Board \u2192' : 'Set Up Evaluation \u2192'}
                </button>
              </div>
            </div>
            )}'''

f = f.replace(old_modal, new_modal)
open('src/components/Dashboard.tsx','w').write(f)
print('Modal updated')
