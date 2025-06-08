import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', rollNo: '', email: '', age: '', gender: '', password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [phase, setPhase] = useState('collect');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendVisible, setResendVisible] = useState(false);

  useEffect(() => {
    if (phase === 'collect') {
      setOtp('');
      setOtpError('');
      setResendVisible(false);
    }
  }, [phase]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.rollNo.trim()) e.rollNo = 'Roll number is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.age || form.age < 1 || form.age > 120) e.age = 'Valid age';
    if (!form.gender) e.gender = 'Select gender';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 chars';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  // 1) Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send OTP');
      }
      setPhase('verify');
      setResendVisible(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to send OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  // 2) Verify OTP & finalize signup
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setOtpError('Enter the OTP');
      return;
    }
    setOtpLoading(true);
    try {
      const res1 = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      });
      if (!res1.ok) {
        const data = await res1.json();
        console.error('fail ho gya:', data.error);
        throw new Error(data.error || 'OTP verification failed');
      }

      const res2 = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res2.ok) {
        const data = await res2.json();
        throw new Error(data.error || 'Signup failed');
      }

      navigate('/login');
    } catch (err) {
      setOtpError(err.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const resend = async () => {
    setOtpLoading(true);
    try {
      const res = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      if (!res.ok) throw new Error('Resend failed');
    } catch {
      setOtpError('Resend failed');
    } finally {
      setOtpLoading(false);
    }
  };

  if (phase === 'verify') {
    return (
      <div className="max-w-md mx-auto p-8">
        <h2 className="mb-4 text-xl">Verify {form.email}</h2>
        <form onSubmit={verifyOtp} className="space-y-4">
          <input
            value={otp}
            onChange={e => { setOtp(e.target.value); setOtpError(''); }}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded"
          />
          {otpError && <p className="text-red-600">{otpError}</p>}

          <button
            type="submit"
            disabled={otpLoading}
            className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            {otpLoading ? 'Verifying…' : 'Verify'}
          </button>

          {resendVisible && (
            <button
              type="button"
              onClick={resend}
              disabled={otpLoading}
              className="mt-2 text-sm text-blue-600 underline"
            >
              {otpLoading ? 'Resending…' : 'Resend Code'}
            </button>
          )}

          <button
            type="button"
            onClick={() => setPhase('collect')}
            className="mt-4 text-sm text-gray-600"
          >
            ← Back
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="mb-4 text-xl">Create Account</h2>
      <form onSubmit={sendOtp} className="space-y-4">
        {errors.submit && <p className="text-red-600">{errors.submit}</p>}

        {['name','rollNo','email','age','gender','password'].map(field => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            {field === 'gender'
              ? <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              : <input
                  name={field}
                  type={field === 'password' ? 'password' : field === 'age' ? 'number' : 'text'}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                />
            }
            {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Sending OTP…' : 'Send OTP'}
        </button>

        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
