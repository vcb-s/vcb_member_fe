import Loadable from 'react-loadable';

export default Loadable({
  loader: () =>
    import('.')
      .then((res) => res.WaterFall)
      .catch(() => () => null),
  loading: () => null,
});
