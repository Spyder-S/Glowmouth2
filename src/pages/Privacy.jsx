import SimplePage from '../components/SimplePage.jsx';

export default function Privacy() {
  return (
    <SimplePage title="Privacy Policy">
      <p>Your privacy is important. We will not share your data with third parties.
      In this demo, no data is sent anywhere unless you configure Supabase.</p>
      <p>Images captured during scans are stored only in your account and are never
      sold. Delete them anytime from Settings.</p>
    </SimplePage>
  );
}
