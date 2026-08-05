'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COUNTRIES = ['Nigeria','Ghana','Kenya','South Africa','United Kingdom','United States','Canada','Australia','Brazil','Mexico','India','Germany','France','Italy','Spain','Netherlands','Portugal','Other'];
const DEPARTMENTS = ['Sales','Customer Support','Marketing','Operations','Logistics','Finance','Human Resources','Technology','Design','Management'];
const POSITIONS = ['Managing Director','Director of Payment Agents','Payment Agent (Third Party Payment)','Receptionist'];
const STEPS = ['Personal Info','Identity','Contact','Employment','Emergency','Set Password'];

export default function EmployeeSetupPage() {
  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL;

  const [form, setForm] = useState({
    fullName:'', preferredName:'', gender:'', dob:'',
    nationality:'', countryOfResidence:'', state:'', city:'',
    address:'', postalCode:'',
    docType:'national_id', docNumber:'', docExpiry:'',
    mobile:'', whatsapp:'',
    department:'', jobPosition:'', employmentType:'', workLocation:'', supervisor:'',
    emergencyName:'', emergencyRelationship:'', emergencyPhone:'', emergencyEmail:'',
    newPassword:'', confirmPassword:'',
  });

  const [passportPhoto, setPassportPhoto] = useState(null);
  const [passportPreview, setPassportPreview] = useState('');
  const [idFront, setIdFront] = useState(null);
  const [idFrontPreview, setIdFrontPreview] = useState('');
  const [idBack, setIdBack] = useState(null);
  const [idBackPreview, setIdBackPreview] = useState('');

  const passportRef = useRef();
  const idFrontRef = useRef();
  const idBackRef = useRef();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('laurea_user');
    if (!stored) { router.push('/auth/login'); return; }
    const emp = JSON.parse(stored);
    if (emp.role !== 'employee') { router.push('/'); return; }
    if (emp.employee_profile_completed) { router.push('/employee/dashboard'); return; }
    setEmployee(emp);
    setForm(f => ({ ...f, fullName: `${emp.first_name} ${emp.last_name}` }));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (setFile, setPreview) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    if (file.type.startsWith('image/')) setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    setError('');
    if (step === 1 && (!form.fullName || !form.gender || !form.dob || !form.nationality || !form.city || !form.address))
      return setError('Please fill in all required fields'), false;
    if (step === 2 && (!form.docNumber || !idFront))
      return setError('Please fill in all required fields and upload your ID'), false;
    if (step === 3 && !form.mobile)
      return setError('Please enter your mobile number'), false;
    if (step === 4 && (!form.department || !form.jobPosition || !form.employmentType))
      return setError('Please fill in all required fields'), false;
    if (step === 5 && (!form.emergencyName || !form.emergencyRelationship || !form.emergencyPhone))
      return setError('Please fill in all required fields'), false;
    if (step === 6) {
      if (form.newPassword && form.newPassword !== form.confirmPassword)
        return setError('Passwords do not match'), false;
      if (form.newPassword && form.newPassword.length < 8)
        return setError('Password must be at least 8 characters'), false;
    }
    return true;
  };

  const handleNext = () => { if (validate()) { setStep(s=>s+1); window.scrollTo(0,0); } };
  const handleBack = () => { setError(''); setStep(s=>s-1); window.scrollTo(0,0); };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('laurea_token');
      const formData = new FormData();
      Object.keys(form).forEach(k => formData.append(k, form[k]));
      if (passportPhoto) formData.append('passportPhoto', passportPhoto);
      if (idFront) formData.append('idFront', idFront);
      if (idBack) formData.append('idBack', idBack);
      const res = await fetch(`${api}/employees/setup`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...employee, employee_profile_completed: true, is_approved: false };
        localStorage.setItem('laurea_user', JSON.stringify(updated));
        router.push('/employee/dashboard');
      } else {
        setError(data.message || 'Failed to save. Please try again.');
      }
    } catch { setError('Connection failed. Please try again.'); }
    setLoading(false);
  };

  const inp = {width:'100%',border:'1px solid rgba(184,150,106,0.2)',padding:'12px 14px',fontSize:'13px',color:'#f5ede0',outline:'none',borderRadius:'10px',background:'rgba(255,255,255,0.04)',boxSizing:'border-box',marginBottom:'12px',fontFamily:'Inter,sans-serif',transition:'border-color 0.2s'};
  const lbl = {fontSize:'10px',fontWeight:'600',color:'rgba(184,150,106,0.8)',textTransform:'uppercase',letterSpacing:'1px',display:'block',marginBottom:'6px'};

  const FileUpload = ({label, preview, ref_, icon, onChange, required=false}) => (
    <div style={{marginBottom:'14px'}}>
      <label style={lbl}>{label}{required?' *':''}</label>
      <div onClick={()=>ref_.current.click()} style={{border:'1px dashed rgba(184,150,106,0.3)',borderRadius:'12px',padding:'1.25rem',textAlign:'center',cursor:'pointer',background:'rgba(184,150,106,0.03)',minHeight:'90px',display:'flex',alignItems:'center',justifyContent:'center',transition:'border-color 0.2s'}}
        onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(184,150,106,0.6)'}
        onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(184,150,106,0.3)'}>
        {preview ? (
          <img src={preview} alt="" style={{maxHeight:'130px',maxWidth:'100%',objectFit:'cover',borderRadius:'8px'}} />
        ) : (
          <div>
            <div style={{fontSize:'28px',marginBottom:'6px',opacity:0.5}}>{icon}</div>
            <div style={{fontSize:'12px',color:'rgba(245,237,224,0.4)'}}>Click to upload</div>
          </div>
        )}
      </div>
    </div>
  );

  if (!employee) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f0a04'}}>
      <div style={{width:'36px',height:'36px',border:'2px solid #b8966a',borderTopColor:'transparent',borderRadius:'50%'}}></div>
    </div>
  );

  const stepIcons = ['👤','🪪','📞','💼','🚨','🔐'];

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f0a04 0%,#1c1208 60%,#2d1f0a 100%)',padding:'2rem 1rem',fontFamily:"'Inter',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'); * { box-sizing: border-box; } input,select,textarea { font-family: 'Inter',sans-serif; } input:focus,select:focus,textarea:focus { border-color: rgba(184,150,106,0.5) !important; outline: none; }`}</style>

      <div style={{maxWidth:'560px',margin:'0 auto'}}>

        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{color:'#f5ede0',fontSize:'18px',fontWeight:'700',letterSpacing:'6px',textTransform:'uppercase'}}>Laurea</div>
          <div style={{color:'rgba(184,150,106,0.5)',fontSize:'7px',letterSpacing:'4px',textTransform:'uppercase',marginTop:'3px'}}>Fashion House · Employee Setup</div>
        </div>

        {/* Step indicators */}
        <div style={{display:'flex',gap:'6px',marginBottom:'1.5rem',overflow:'auto',paddingBottom:'4px'}}>
          {STEPS.map((s,i) => (
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',flex:1,minWidth:'48px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'10px',background:i+1===step?'rgba(184,150,106,0.2)':i+1<step?'rgba(59,109,17,0.2)':'rgba(255,255,255,0.03)',border:`1px solid ${i+1===step?'rgba(184,150,106,0.6)':i+1<step?'rgba(59,109,17,0.4)':'rgba(255,255,255,0.06)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',transition:'all 0.2s'}}>
                {i+1<step ? '✓' : stepIcons[i]}
              </div>
              {!isMobile && <div style={{fontSize:'9px',color:i+1===step?'rgba(184,150,106,0.8)':'rgba(245,237,224,0.2)',textAlign:'center',letterSpacing:'0.5px'}}>{s}</div>}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'4px',height:'3px',marginBottom:'1.5rem'}}>
          <div style={{background:'linear-gradient(90deg,#b8966a,#d4af80)',height:'3px',borderRadius:'4px',width:`${(step/STEPS.length)*100}%`,transition:'width 0.4s ease'}} />
        </div>

        {/* Card */}
        <div style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(20px)',border:'1px solid rgba(184,150,106,0.12)',borderRadius:'24px',padding:isMobile?'1.5rem':'2rem',boxShadow:'0 25px 80px rgba(0,0,0,0.5)'}}>

          {/* Step header */}
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1.5rem',paddingBottom:'1rem',borderBottom:'1px solid rgba(184,150,106,0.08)'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'rgba(184,150,106,0.1)',border:'1px solid rgba(184,150,106,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0}}>
              {stepIcons[step-1]}
            </div>
            <div>
              <div style={{fontSize:'16px',fontWeight:'600',color:'#f5ede0'}}>{STEPS[step-1]}</div>
              <div style={{fontSize:'11px',color:'rgba(245,237,224,0.3)'}}>Step {step} of {STEPS.length}</div>
            </div>
          </div>

          {error && (
            <div style={{background:'rgba(204,0,0,0.1)',border:'1px solid rgba(204,0,0,0.3)',borderRadius:'10px',padding:'12px 14px',marginBottom:'1rem',fontSize:'13px',color:'#ff6b6b',display:'flex',gap:'8px'}}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <label style={lbl}>Full Name *</label>
              <input style={inp} value={form.fullName} onChange={e=>set('fullName',e.target.value)} placeholder="First Middle Last" />
              <label style={lbl}>Preferred Name</label>
              <input style={inp} value={form.preferredName} onChange={e=>set('preferredName',e.target.value)} placeholder="What should we call you?" />
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div>
                  <label style={lbl}>Gender *</label>
                  <select style={inp} value={form.gender} onChange={e=>set('gender',e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Date of Birth *</label>
                  <input style={inp} type="date" value={form.dob} onChange={e=>set('dob',e.target.value)} />
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div>
                  <label style={lbl}>Nationality *</label>
                  <input style={inp} value={form.nationality} onChange={e=>set('nationality',e.target.value)} placeholder="e.g. Nigerian" />
                </div>
                <div>
                  <label style={lbl}>Country of Residence *</label>
                  <select style={inp} value={form.countryOfResidence} onChange={e=>set('countryOfResidence',e.target.value)}>
                    <option value="">Select</option>
                    {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div>
                  <label style={lbl}>State/Province</label>
                  <input style={inp} value={form.state} onChange={e=>set('state',e.target.value)} placeholder="State" />
                </div>
                <div>
                  <label style={lbl}>City *</label>
                  <input style={inp} value={form.city} onChange={e=>set('city',e.target.value)} placeholder="City" />
                </div>
              </div>
              <label style={lbl}>Residential Address *</label>
              <input style={inp} value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Street address" />
              <label style={lbl}>Passport-size Photo</label>
              <div onClick={()=>passportRef.current.click()} style={{border:'1px dashed rgba(184,150,106,0.3)',borderRadius:'12px',padding:'1.25rem',textAlign:'center',cursor:'pointer',background:'rgba(184,150,106,0.03)',marginBottom:'12px'}}>
                {passportPreview ? <img src={passportPreview} alt="" style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover'}} /> : <div><div style={{fontSize:'28px',opacity:0.5}}>📸</div><div style={{fontSize:'12px',color:'rgba(245,237,224,0.4)',marginTop:'4px'}}>Upload passport photo</div></div>}
              </div>
              <input ref={passportRef} type="file" accept="image/*" onChange={handleFile(setPassportPhoto,setPassportPreview)} style={{display:'none'}} />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <label style={lbl}>Document Type</label>
              <select style={inp} value={form.docType} onChange={e=>set('docType',e.target.value)}>
                <option value="national_id">National ID</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="residence_permit">Residence Permit</option>
                <option value="voters_card">Voter's Card</option>
                <option value="nin">NIN</option>
              </select>
              <label style={lbl}>Document Number *</label>
              <input style={inp} value={form.docNumber} onChange={e=>set('docNumber',e.target.value)} placeholder="Document number" />
              <label style={lbl}>Expiry Date (if applicable)</label>
              <input style={inp} type="date" value={form.docExpiry} onChange={e=>set('docExpiry',e.target.value)} />
              <FileUpload label="Front of ID" preview={idFrontPreview} ref_={idFrontRef} icon="🪪" onChange={handleFile(setIdFront,setIdFrontPreview)} required />
              <input ref={idFrontRef} type="file" accept="image/*" onChange={handleFile(setIdFront,setIdFrontPreview)} style={{display:'none'}} />
              <FileUpload label="Back of ID" preview={idBackPreview} ref_={idBackRef} icon="🪪" onChange={handleFile(setIdBack,setIdBackPreview)} />
              <input ref={idBackRef} type="file" accept="image/*" onChange={handleFile(setIdBack,setIdBackPreview)} style={{display:'none'}} />
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <label style={lbl}>Mobile Number *</label>
              <input style={inp} type="tel" value={form.mobile} onChange={e=>set('mobile',e.target.value)} placeholder="+234 000 000 0000" />
              <label style={lbl}>WhatsApp Number (Optional)</label>
              <input style={inp} type="tel" value={form.whatsapp} onChange={e=>set('whatsapp',e.target.value)} placeholder="+234 000 000 0000" />
              <div style={{background:'rgba(184,150,106,0.06)',border:'1px solid rgba(184,150,106,0.15)',borderRadius:'10px',padding:'12px 14px',fontSize:'12px',color:'rgba(245,237,224,0.4)',lineHeight:'1.7'}}>
                📧 Your login email: <strong style={{color:'rgba(184,150,106,0.7)'}}>{employee?.email}</strong>
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <label style={lbl}>Job Position *</label>
              <select style={inp} value={form.jobPosition} onChange={e=>set('jobPosition',e.target.value)}>
                <option value="">Select position</option>
                {POSITIONS.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
              <label style={lbl}>Department *</label>
              <select style={inp} value={form.department} onChange={e=>set('department',e.target.value)}>
                <option value="">Select department</option>
                {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
              <label style={lbl}>Employment Type *</label>
              <select style={inp} value={form.employmentType} onChange={e=>set('employmentType',e.target.value)}>
                <option value="">Select type</option>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div>
                  <label style={lbl}>Work Location</label>
                  <input style={inp} value={form.workLocation} onChange={e=>set('workLocation',e.target.value)} placeholder="Remote / Office" />
                </div>
                <div>
                  <label style={lbl}>Supervisor</label>
                  <input style={inp} value={form.supervisor} onChange={e=>set('supervisor',e.target.value)} placeholder="Manager name" />
                </div>
              </div>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <label style={lbl}>Full Name *</label>
              <input style={inp} value={form.emergencyName} onChange={e=>set('emergencyName',e.target.value)} placeholder="Emergency contact name" />
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div>
                  <label style={lbl}>Relationship *</label>
                  <select style={inp} value={form.emergencyRelationship} onChange={e=>set('emergencyRelationship',e.target.value)}>
                    <option value="">Select</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="child">Child</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Phone Number *</label>
                  <input style={inp} type="tel" value={form.emergencyPhone} onChange={e=>set('emergencyPhone',e.target.value)} placeholder="+234 000 000 0000" />
                </div>
              </div>
              <label style={lbl}>Email Address (Optional)</label>
              <input style={inp} type="email" value={form.emergencyEmail} onChange={e=>set('emergencyEmail',e.target.value)} placeholder="emergency@email.com" />
            </>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <>
              <p style={{fontSize:'13px',color:'rgba(245,237,224,0.4)',marginBottom:'1.5rem',lineHeight:'1.7'}}>
                Set a personal password. Leave blank to keep your current password.
              </p>
              <label style={lbl}>New Password</label>
              <input style={inp} type="password" value={form.newPassword} onChange={e=>set('newPassword',e.target.value)} placeholder="Min 8 characters" />
              <label style={lbl}>Confirm New Password</label>
              <input style={inp} type="password" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)} placeholder="Repeat password" />
              <div style={{background:'rgba(184,150,106,0.06)',border:'1px solid rgba(184,150,106,0.15)',borderRadius:'10px',padding:'12px',fontSize:'12px',color:'rgba(245,237,224,0.4)',lineHeight:'1.7',marginBottom:'1.5rem'}}>
                ✅ After submitting your application will be reviewed by admin. You will receive an email once approved.
              </div>
              <button onClick={handleSubmit} disabled={loading}
                style={{width:'100%',background:'linear-gradient(135deg,#b8966a,#8a6a3e)',color:'#1c1208',border:'none',padding:'15px',fontSize:'13px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'12px',opacity:loading?0.7:1,fontFamily:'Inter,sans-serif',boxSizing:'border-box'}}>
                {loading?'Submitting...':'Submit Application'}
              </button>
            </>
          )}

          {/* Navigation */}
          <div style={{display:'flex',gap:'10px',marginTop:'1.5rem'}}>
            {step > 1 && (
              <button onClick={handleBack} style={{flex:1,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',padding:'13px',fontSize:'13px',cursor:'pointer',borderRadius:'12px',color:'rgba(245,237,224,0.4)',fontFamily:'Inter,sans-serif'}}>
                ← Back
              </button>
            )}
            {step < 6 && (
              <button onClick={handleNext} style={{flex:2,background:'rgba(184,150,106,0.1)',border:'1px solid rgba(184,150,106,0.3)',color:'#b8966a',padding:'13px',fontSize:'13px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'12px',fontFamily:'Inter,sans-serif'}}>
                Continue →
              </button>
            )}
          </div>
        </div>

        <p style={{textAlign:'center',fontSize:'11px',color:'rgba(245,237,224,0.15)',marginTop:'1.5rem'}}>
          © 2026 Laurea Fashion House
        </p>
      </div>
    </div>
  );
}