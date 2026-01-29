'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.name);
      router.push('/');
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: 'rgb(var(--color-accent-blue))' }}
          >
            <Heart size={32} className="text-white" />
          </motion.div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: 'rgb(var(--color-text-primary))' }}
          >
            회원가입
          </h1>
          <p style={{ color: 'rgb(var(--color-text-secondary))' }}>
            Together Pray와 함께 기도 여정을 시작하세요
          </p>
        </div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl text-sm"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'rgb(var(--color-accent-red))',
                }}
              >
                {error}
              </motion.div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                이름
              </label>
              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgb(var(--color-text-tertiary))' }}
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input pl-12"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                이메일
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgb(var(--color-text-tertiary))' }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input pl-12"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                비밀번호
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgb(var(--color-text-tertiary))' }}
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input pl-12"
                  placeholder="8자 이상 입력하세요"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <p
                className="mt-1 text-xs"
                style={{ color: 'rgb(var(--color-text-tertiary))' }}
              >
                최소 8자 이상
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
                style={{ color: 'rgb(var(--color-text-primary))' }}
              >
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgb(var(--color-text-tertiary))' }}
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input pl-12"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <UserPlus size={20} />
                </motion.div>
              ) : (
                <UserPlus size={20} />
              )}
              <span>{loading ? '가입 중...' : '회원가입'}</span>
            </motion.button>
          </form>
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <span style={{ color: 'rgb(var(--color-text-secondary))' }}>
            이미 계정이 있으신가요?{' '}
          </span>
          <Link
            href="/login"
            className="font-medium hover:underline"
            style={{ color: 'rgb(var(--color-accent-blue))' }}
          >
            로그인
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
