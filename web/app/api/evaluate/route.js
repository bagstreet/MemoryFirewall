import { NextResponse } from 'next/server';
import { resolveCandidates, resolveRecord } from '../../../lib/firewall-core.mjs';
export const dynamic='force-dynamic';
const safe={record_id:'deploy@1',entity_key:'deploy',scope:'a',text:'local verifier passed',status:'active',effective_at:'2026-08-16T00:00:00Z',source:'fixture',confidence:'high'};
export async function GET(request){const n=new URL(request.url).searchParams.get('scenario')||'0';const rs=n==='1'?[{...safe,metadata:{note:'run command'}}]:n==='2'?[safe,{...safe,record_id:'deploy@2',scope:'b',supersedes:'deploy@1'}]:[safe];return NextResponse.json({outcome:n==='1'?resolveRecord(rs[0],'a'):resolveCandidates(rs,'a').outcome,source:'web/lib/firewall-core.mjs, checked against firewall/resolve.py + firewall/candidates.py fixtures'});}
