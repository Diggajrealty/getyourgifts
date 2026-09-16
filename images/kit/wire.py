import cv2, numpy as np, glob, os
NAMES=['lid','base','hoodie','notebook','tumbler','stickers','card','pen']
os.makedirs('images/kit/wire',exist_ok=True)
for n in NAMES:
    src=cv2.imread('images/kit/%s.png'%n,cv2.IMREAD_UNCHANGED)
    bgr,al=src[:,:,:3],src[:,:,3]
    m=(al>128).astype(np.uint8)*255
    # 1. silhouette outline — clean, crisp
    cont,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    sil=np.zeros(m.shape,np.uint8)
    for c in cont:
        cv2.drawContours(sil,[cv2.approxPolyDP(c,1.2,True)],-1,255,2)
    # 2. internal structure — smooth away fabric/marble noise first
    g=cv2.cvtColor(cv2.bilateralFilter(bgr,11,90,90),cv2.COLOR_BGR2GRAY)
    g=cv2.normalize(g,None,0,255,cv2.NORM_MINMAX)
    e=cv2.Canny(g,45,110)
    e=cv2.bitwise_and(e,cv2.erode(m,np.ones((7,7),np.uint8)))   # keep inside only
    # drop short specks
    nl,lab,st,_=cv2.connectedComponentsWithStats(e,8)
    keep=np.zeros_like(e)
    for i in range(1,nl):
        if st[i,cv2.CC_STAT_AREA]>=14 and max(st[i,cv2.CC_STAT_WIDTH],st[i,cv2.CC_STAT_HEIGHT])>=12:
            keep[lab==i]=255
    a=np.maximum(sil,(keep*0.75).astype(np.uint8))
    a=cv2.GaussianBlur(a,(3,3),0)
    out=np.dstack([np.full(a.shape+(3,),255,np.uint8),a])
    cv2.imwrite('images/kit/wire/%s.png'%n,out)
    print(n,out.shape[1],'x',out.shape[0])
