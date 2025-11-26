// Migration page - accessible at /migrate route
// This page allows you to manually trigger data migration from constants.js to Firestore
import React, { useState } from 'react';
import { migrateToFirestore, forceMigrateToFirestore } from '../firebase/migrate.js';

export const Migrate = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleMigrate = async () => {
    setLoading(true);
    setStatus('Migrating data to Firestore...');
    setResult(null);
    
    try {
      const result = await migrateToFirestore();
      setResult(result);
      if (result.success) {
        setStatus('✅ Migration completed successfully! Refresh the page to see the data from Firestore.');
      } else {
        setStatus(`⚠️ ${result.message}`);
      }
    } catch (error) {
      setResult({ success: false, error: error.message });
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForceMigrate = async () => {
    if (!window.confirm('This will overwrite all existing data in Firestore. Are you sure?')) {
      return;
    }

    setLoading(true);
    setStatus('Force migrating data to Firestore (overwriting existing data)...');
    setResult(null);
    
    try {
      const result = await forceMigrateToFirestore();
      setResult(result);
      if (result.success) {
        setStatus('✅ Force migration completed successfully! Refresh the page to see the data from Firestore.');
      } else {
        setStatus(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setResult({ success: false, error: error.message });
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-8">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-900">Firestore Migration Tool</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>What does this do?</strong><br />
            This tool transfers all data from <code className="bg-blue-100 px-1 rounded">constants.js</code> to Cloud Firestore.
            After migration, your app will load all content from Firestore instead of the local constants file.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={handleMigrate}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Migrating...' : 'Migrate Data to Firestore'}
          </button>

          <button
            onClick={handleForceMigrate}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Migrating...' : 'Force Migrate (Overwrite Existing Data)'}
          </button>
        </div>

        {status && (
          <div className={`p-4 rounded-lg mb-4 ${
            status.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' :
            status.includes('⚠️') ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
            'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="text-sm whitespace-pre-line">{status}</p>
          </div>
        )}

        {result && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Migration Result:</h3>
            <pre className="text-xs overflow-auto bg-slate-100 p-2 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            After migration, refresh the page or navigate back to the home page.
            The app will automatically load data from Firestore.
          </p>
        </div>
      </div>
    </div>
  );
};

