import { useState } from "react";
import { Icon } from "./components/Icon";
import { Header } from "./components/Header";
import { RepoRow } from "./components/RepoRow";
import { LogOutput } from "./components/LogOutput";
import { AddRepoModal } from "./components/AddRepoModal";
import { ToastContainer } from "./components/Toast";
import { useRepos } from "./hooks/useRepos";
import { useAppStore } from "./store";
import { fetchAllRepos } from "./api";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { refresh } = useRepos();
  const { repos, setRepos, addLog } = useAppStore();

  const handleRefresh = async () => {
    setRefreshing(true);
    addLog("Running refresh all…", "info");
    await refresh();
    addLog("Refreshed all repositories", "ok");
    setRefreshing(false);
  };

  const handleFetchAll = async () => {
    setFetching(true);
    addLog("Running fetch all…", "info");
    try {
      const updated = await fetchAllRepos();
      setRepos(updated);
      addLog("Fetched all repositories", "ok");
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="h-full">
      <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onFetchAll={handleFetchAll}
          fetching={fetching}
          onAddRepo={() => setShowModal(true)}
        />
        <div className="min-h-0 flex-1 overflow-y-scroll p-6">
          {repos.length === 0 ? (
            <div className="mx-auto max-w-7xl pt-16 text-center text-overlay0">
              <Icon name="bookmarks" size={56} />
              <h2 className="mt-2 text-2xl font-medium text-subtext0">
                No repositories yet
              </h2>
              <p className="mt-1">Add a repository to get started.</p>
              <button
                type="button"
                className="button button-primary mt-5"
                onClick={() => setShowModal(true)}
              >
                Add repository
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="">
                {repos.map((r) => (
                  <RepoRow key={r.path} repo={r} />
                ))}
              </div>
            </div>
          )}
        </div>
        <LogOutput />
      </main>

      {showModal && (
        <AddRepoModal
          onClose={() => setShowModal(false)}
          onAdded={handleRefresh}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
