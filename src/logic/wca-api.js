import { wcaAccessToken } from './auth';
import { WCA_ORIGIN } from './wca-env';
import { pick } from './utils';

export const getUpcomingManageableCompetitions = () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    managed_by_me: true,
    start: oneWeekAgo.toISOString()
  });
  return wcaApiFetch(`/competitions?${params}}`);
};

export const getWcif = competitionId =>
  wcaApiFetch(`/competitions/${competitionId}/wcif`);

const updateWcif = wcif =>
  wcaApiFetch(`/competitions/${wcif.id}/wcif`, {
    method: 'PATCH',
    body: JSON.stringify(wcif)
  });

export const saveWcifChanges = (previousWcif, newWcif) => {
  const keysDiff = Object.keys(newWcif).filter(key => previousWcif[key] !== newWcif[key]);
  if (keysDiff.length === 0) return Promise.resolve();
  return updateWcif(pick(newWcif, keysDiff));
};

const wcaApiFetch = (path, fetchOptions = {}) => {
  const baseApiUrl = `${WCA_ORIGIN}/api/v0`;

  return fetch(`${baseApiUrl}${path}`, Object.assign({}, fetchOptions, {
    headers: new Headers({
      'Authorization': `Bearer ${wcaAccessToken()}`,
      'Content-Type': 'application/json'
    })
  }))
  .then(response => response.json());
};
