'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COUNTRIES = ['Nigeria','Ghana','Kenya','South Africa','United Kingdom','United States','Canada','Australia','Brazil','Mexico','India','Germany','France','Italy','Spain','Netherlands','Portugal','Other'];
const DEPARTMENTS = ['Sales','Customer Support','Marketing','Operations','Logistics','Finance','Human Resources','Technology','Design','Management'];
const POSITIONS = ['Sales Agent','Customer Support Agent','Marketing Officer','Operations Manager','Logistics Coordinator','Finance Officer','HR Officer','Software Developer','Graphic Designer','Store Manager','Brand Ambassador','Social Media Manager','Delivery Agent','Intern'];
const STEPS = ['Personal Info','Identity','Contact','Employment','Emergency','Account Setup'];

export default function EmployeeSetupPage() {
  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
        const updated = { ...employee, employee_profile_completed: true };
        localStorage.setItem('laurea_user', JSON.stringify(updated));
        router.push('/employee/dashboard');
      } else {
        setError(data.message || 'Failed to save. Please try again.');
      }
    } catch { setError('Connection failed. Please try again.'); }
    setLoading(false);
  };

  const inp = { width:'100%', border:'1px solid #e0d8cc', padding:'11px 13px', fontSize:'13px', color:'#1c1208', outline:'none', borderRadius:'8px', background:'#faf8f5', boxSizing:'border-box', marginBottom:'12px' };
  const lbl = { fontSize:'11px', fontWeight:'600', color:'#6b5a3e', textTransform:'uppercase', letterSpacing:'0.5px', display:'block', marginBottom:'5px' };

  if (!employee) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#faf8f5'}}>
      <p style={{color:'#8a7a6a'}}>Loading...</p>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1c1208 0%,#2d1f0a 100%)',padding:'2rem 1rem'}}>
      <div style={{width:'100%',maxWidth:'520px',margin:'0 auto'}}>

        <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
          <div style={{color:'#f5ede0',fontSize:'16px',fontWeight:'600',letterSpacing:'4px',textTransform:'uppercase'}}>Laurea</div>
          <div style={{color:'#b8966a',fontSize:'7px',letterSpacing:'3px',textTransform:'uppercase'}}>Fashion House — Employee Setup</div>
        </div>

        <div style={{marginBottom:'1.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
            <span style={{fontSize:'11px',color:'rgba(245,237,224,0.6)'}}>{STEPS[step-1]}</span>
            <span style={{fontSize:'11px',color:'#b8966a'}}>{step}/{STEPS.length}</span>
          </div>
          <div style={{background:'rgba(245,237,224,0.1)',borderRadius:'4px',height:'4px'}}>
            <div style={{background:'#b8966a',height:'4px',borderRadius:'4px',width:`${(step/STEPS.length)*100}%`,transition:'width 0.3s'}} />
          </div>
        </div>

        <div style={{background:'#fff',borderRadius:'16px',padding:'1.75rem',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>

          {error && <div style={{background:'#fff0f0',border:'1px solid #ffcccc',borderRadius:'8px',padding:'10px 14px',marginBottom:'1rem',fontSize:'12px',color:'#cc0000'}}>⚠️ {error}</div>}

          {step === 1 && (
            <>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:'#1c1208',marginBottom:'1.25rem'}}>Personal Information</h2>
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
              <div onClick={()=>passportRef.current.click()} style={{border:'2px dashed #e0d8cc',borderRadius:'8px',padding:'1rem',textAlign:'center',cursor:'pointer',background:'#faf8f5',marginBottom:'12px'}}>
                {passportPreview ? <img src={passportPreview} alt="" style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover'}} /> : <div><div style={{fontSize:'28px'}}>📸</div><div style={{fontSize:'11px',color:'#8a7a6a'}}>Upload passport photo</div></div>}
              </div>
              <input ref={passportRef} type="file" accept="image/*" onChange={handleFile(setPassportPhoto,setPassportPreview)} style={{display:'none'}} />
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:'#1c1208',marginBottom:'1.25rem'}}>Identity Verification</h2>
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
              <label style={lbl}>Upload Front of ID *</label>
              <div onClick={()=>idFrontRef.current.click()} style={{border:'2px dashed #e0d8cc',borderRadius:'8px',padding:'1rem',textAlign:'center',cursor:'pointer',background:'#faf8f5',marginBottom:'12px'}}>
                {idFrontPreview ? <img src={idFrontPreview} alt="" style={{maxHeight:'120px',maxWidth:'100%',objectFit:'cover',borderRadius:'6px'}} /> : <div><div style={{fontSize:'28px'}}>🪪</div><div style={{fontSize:'11px',color:'#8a7a6a'}}>Click to upload front of ID</div></div>}
              </div>
              <input ref={idFrontRef} type="file" accept="image/*" onChange={handleFile(setIdFront,setIdFrontPreview)} style={{display:'none'}} />
              <label style={lbl}>Upload Back of ID</label>
              <div onClick={()=>idBackRef.current.click()} style={{border:'2px dashed #e0d8cc',borderRadius:'8px',padding:'1rem',textAlign:'center',cursor:'pointer',background:'#faf8f5',marginBottom:'12px'}}>
                {idBackPreview ? <img src={idBackPreview} alt="" style={{maxHeight:'120px',maxWidth:'100%',objectFit:'cover',borderRadius:'6px'}} /> : <div><div style={{fontSize:'28px'}}>🪪</div><div style={{fontSize:'11px',color:'#8a7a6a'}}>Click to upload back of ID</div></div>}
              </div>
              <input ref={idBackRef} type="file" accept="image/*" onChange={handleFile(setIdBack,setIdBackPreview)} style={{display:'none'}} />
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:'#1c1208',marginBottom:'1.25rem'}}>Contact Information</h2>
              <label style={lbl}>Mobile Number *</label>
              <input style={inp} type="tel" value={form.mobile} onChange={e=>set('mobile',e.target.value)} placeholder="+234 000 000 0000" />
              <label style={lbl}>WhatsApp Number (Optional)</label>
              <input style={inp} type="tel" value={form.whatsapp} onChange={e=>set('whatsapp',e.target.value)} placeholder="+234 000 000 0000" />
              <div style={{background:'#faf8f5',border:'1px solid #e0d8cc',borderRadius:'8px',padding:'12px',fontSize:'12px',color:'#8a7a6a',lineHeight:'1.7'}}>
                📧 Your email: <strong>{employee?.email}</strong><br/>
                This is your login email and cannot be changed.
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:'#1c1208',marginBottom:'1.25rem'}}>Employment Information</h2>
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

          {step === 5 && (
            <>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:'#1c1208',marginBottom:'1.25rem'}}>Emergency Contact</h2>
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

          {step === 6 && (
            <>
              <h2 style={{fontSize:'17px',fontWeight:'600',color:'#1c1208',marginBottom:'1.25rem'}}>Set Your Password</h2>
              <p style={{fontSize:'12px',color:'#8a7a6a',marginBottom:'1.25rem'}}>Change your temporary password to something personal and secure.</p>
              <label style={lbl}>New Password</label>
              <input style={inp} type="password" value={form.newPassword} onChange={e=>set('newPassword',e.target.value)} placeholder="Min 8 characters" />
              <label style={lbl}>Confirm New Password</label>
              <input style={inp} type="password" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)} placeholder="Repeat password" />
              <div style={{background:'#fdf6ec',border:'1px solid #f0c040',borderRadius:'8px',padding:'12px',fontSize:'12px',color:'#8a7a6a',lineHeight:'1.7',marginBottom:'12px'}}>
                ✅ After submitting you will be taken to your employee dashboard.
              </div>
              <button onClick={handleSubmit} disabled={loading}
                style={{width:'100%',background:'#b8966a',color:'#1c1208',border:'none',padding:'14px',fontSize:'13px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px',opacity:loading?0.7:1,boxSizing:'border-box'}}>
                {loading?'Saving...':'Complete Setup & Enter Dashboard'}
              </button>
            </>
          )}

          {step > 1 && step < 6 && (
            <div style={{display:'flex',gap:'10px',marginTop:'1.25rem'}}>
              <button onClick={handleBack} style={{flex:1,background:'none',border:'1px solid #e0d8cc',padding:'12px',fontSize:'13px',cursor:'pointer',borderRadius:'8px',color:'#8a7a6a'}}>← Back</button>
              <button onClick={handleNext} style={{flex:2,background:'#1c1208',color:'#f5ede0',border:'none',padding:'12px',fontSize:'13px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px'}}>Continue →</button>
            </div>
          )}
          {step === 1 && (
            <button onClick={handleNext} style={{width:'100%',background:'#1c1208',color:'#f5ede0',border:'none',padding:'14px',fontSize:'13px',fontWeight:'600',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',borderRadius:'8px',marginTop:'1.25rem',boxSizing:'border-box'}}>Continue →</button>
          )}
          {step === 6 && (
            <button onClick={handleBack} style={{width:'100%',background:'none',border:'1px solid #e0d8cc',padding:'12px',fontSize:'13px',cursor:'pointer',borderRadius:'8px',marginTop:'10px',color:'#8a7a6a'}}>← Back</button>
          )}
        </div>
      </div>
    </div>
  );
}