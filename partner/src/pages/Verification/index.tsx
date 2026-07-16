import { useRef, useState } from 'react';
import { ShieldCheck, ShieldAlert, Upload, FileText, CreditCard, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

interface DocState { file: File | null; preview: string | null; uploaded: boolean; }
const init = (): DocState => ({ file: null, preview: null, uploaded: false });

function DocCard({
  type, icon: Icon, label, hint, state, inputRef, onChange, disabled,
}: {
  type: string; icon: React.ElementType; label: string; hint: string;
  state: DocState; inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${state.uploaded ? 'border-emerald-200' : 'border-gray-100'}`}>
      <div className={`px-4 py-3 flex items-center gap-3 border-b ${state.uploaded ? 'border-emerald-100 bg-emerald-50/60' : 'border-gray-50 bg-gray-50/50'}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${state.uploaded ? 'bg-emerald-100' : 'bg-sky-50'}`}>
          <Icon size={17} className={state.uploaded ? 'text-emerald-600' : 'text-sky-500'} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-sm">{label}</p>
          <p className="text-xs text-gray-400">{hint}</p>
        </div>
        {state.uploaded && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
            <CheckCircle size={11} /> Uploaded
          </span>
        )}
      </div>

      <div className="p-4">
        {state.preview ? (
          <div className="relative">
            <img src={state.preview} alt={type} className="w-full h-40 object-cover rounded-xl" />
            {state.uploaded && (
              <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                <div className="bg-emerald-500 rounded-2xl p-3">
                  <ShieldCheck size={28} className="text-white" />
                </div>
              </div>
            )}
            {!state.uploaded && !disabled && (
              <button
                onClick={() => inputRef.current?.click()}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-sky-600 shadow-sm"
              >
                Replace
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => !disabled && inputRef.current?.click()}
            disabled={disabled}
            className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-sky-300 hover:bg-sky-50/40 hover:text-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Upload size={20} />
            </div>
            <span className="text-xs font-semibold">Tap to upload photo</span>
            <span className="text-[10px] text-gray-300">JPG, PNG or PDF</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default function Verification() {
  const { partner } = useAuthStore();
  const verified = partner?.verified ?? false;
  const [aadhar, setAadhar] = useState<DocState>(init());
  const [license, setLicense] = useState<DocState>(init());
  const [submitting, setSubmitting] = useState(false);
  const aadharRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);

  const pickFile = (type: 'aadhar' | 'license', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const preview = ev.target?.result as string;
      if (type === 'aadhar') setAadhar({ file, preview, uploaded: false });
      else setLicense({ file, preview, uploaded: false });
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!aadhar.file || !license.file) { toast.error('Upload both Aadhar and License'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setAadhar(prev => ({ ...prev, uploaded: true }));
    setLicense(prev => ({ ...prev, uploaded: true }));
    toast.success('Documents submitted! Verification within 24 hours.');
    setSubmitting(false);
  };

  const submitted = aadhar.uploaded && license.uploaded;
  const steps = [
    { label: 'Upload documents',          done: !!aadhar.file && !!license.file },
    { label: 'Admin review (≤ 24 hrs)',   done: submitted },
    { label: 'Account verified',          done: verified },
  ];

  return (
    <AppShell title="Verification" back>
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-8 pb-10">
        {/* Hero */}
        <div className={`rounded-2xl p-4 md:p-5 flex items-center gap-4 ${verified ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-400 to-orange-400'}`}>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            {verified
              ? <ShieldCheck size={26} className="text-white" />
              : <ShieldAlert size={26} className="text-white" />
            }
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-white text-base">
              {verified ? 'Account Verified ✓' : 'Verification Needed'}
            </p>
            <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
              {verified
                ? 'Your documents are approved. You can accept all jobs.'
                : 'Upload your documents to start accepting jobs.'
              }
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {/* Progress tracker */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Verification Progress</p>
            <div className="relative md:flex md:gap-6">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100 md:hidden" />
              <div className="space-y-4 md:space-y-0 md:flex md:flex-1 md:gap-4">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 md:flex-1 md:flex-col md:text-center md:items-center md:gap-2 relative">
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${s.done ? 'bg-emerald-500 shadow-md shadow-emerald-200' : 'bg-gray-100'}`}>
                      {s.done
                        ? <CheckCircle size={16} className="text-white" />
                        : <Clock size={14} className="text-gray-400" />
                      }
                    </div>
                    <div className="flex-1 md:flex-none">
                      <p className={`text-sm font-semibold ${s.done ? 'text-emerald-700' : 'text-gray-500'}`}>{s.label}</p>
                      {i === 0 && !s.done && (
                        <p className="text-[10px] text-gray-400 mt-0.5">Upload Aadhar & Driving License below</p>
                      )}
                      {i === 1 && steps[0].done && !s.done && (
                        <p className="text-[10px] text-amber-500 mt-0.5">Under review…</p>
                      )}
                    </div>
                    {s.done && (
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Done</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocCard
              type="aadhar" icon={FileText} label="Aadhar Card" hint="Front side · clear photo"
              state={aadhar} inputRef={aadharRef}
              onChange={e => pickFile('aadhar', e)} disabled={verified}
            />
            <DocCard
              type="license" icon={CreditCard} label="Driving License" hint="Front side · clear photo"
              state={license} inputRef={licenseRef}
              onChange={e => pickFile('license', e)} disabled={verified}
            />
          </div>

          {!submitted && !verified && (
            <div className="md:max-w-xs md:ml-auto">
              <Button
                fullWidth size="lg" loading={submitting} onClick={submit}
                disabled={!aadhar.file || !license.file}
              >
                Submit for Verification
              </Button>
            </div>
          )}

          {submitted && !verified && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <Clock size={20} className="text-amber-500 mx-auto mb-2" />
              <p className="font-bold text-amber-700 text-sm">Under Review</p>
              <p className="text-xs text-amber-600 mt-1">Our team will verify your documents within 24 hours.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
