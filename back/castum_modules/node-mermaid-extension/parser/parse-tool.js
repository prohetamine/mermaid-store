Object.keys(bongacams.map(e => {try{ return JSON.parse(e.data).type } catch (e) {}}).filter(e => e).reduce((ctx, elem) => {
  ctx[elem] = true
  return ctx
}, {})) // return types
