import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model IspBundle
 *
 */
export type IspBundleModel = runtime.Types.Result.DefaultSelection<Prisma.$IspBundlePayload>;
export type AggregateIspBundle = {
    _count: IspBundleCountAggregateOutputType | null;
    _avg: IspBundleAvgAggregateOutputType | null;
    _sum: IspBundleSumAggregateOutputType | null;
    _min: IspBundleMinAggregateOutputType | null;
    _max: IspBundleMaxAggregateOutputType | null;
};
export type IspBundleAvgAggregateOutputType = {
    id: number | null;
    price: number | null;
};
export type IspBundleSumAggregateOutputType = {
    id: number | null;
    price: number | null;
};
export type IspBundleMinAggregateOutputType = {
    id: number | null;
    network: string | null;
    size: string | null;
    price: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IspBundleMaxAggregateOutputType = {
    id: number | null;
    network: string | null;
    size: string | null;
    price: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type IspBundleCountAggregateOutputType = {
    id: number;
    network: number;
    size: number;
    price: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type IspBundleAvgAggregateInputType = {
    id?: true;
    price?: true;
};
export type IspBundleSumAggregateInputType = {
    id?: true;
    price?: true;
};
export type IspBundleMinAggregateInputType = {
    id?: true;
    network?: true;
    size?: true;
    price?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IspBundleMaxAggregateInputType = {
    id?: true;
    network?: true;
    size?: true;
    price?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type IspBundleCountAggregateInputType = {
    id?: true;
    network?: true;
    size?: true;
    price?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type IspBundleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which IspBundle to aggregate.
     */
    where?: Prisma.IspBundleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IspBundles to fetch.
     */
    orderBy?: Prisma.IspBundleOrderByWithRelationInput | Prisma.IspBundleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.IspBundleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IspBundles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IspBundles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned IspBundles
    **/
    _count?: true | IspBundleCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: IspBundleAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: IspBundleSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: IspBundleMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: IspBundleMaxAggregateInputType;
};
export type GetIspBundleAggregateType<T extends IspBundleAggregateArgs> = {
    [P in keyof T & keyof AggregateIspBundle]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIspBundle[P]> : Prisma.GetScalarType<T[P], AggregateIspBundle[P]>;
};
export type IspBundleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IspBundleWhereInput;
    orderBy?: Prisma.IspBundleOrderByWithAggregationInput | Prisma.IspBundleOrderByWithAggregationInput[];
    by: Prisma.IspBundleScalarFieldEnum[] | Prisma.IspBundleScalarFieldEnum;
    having?: Prisma.IspBundleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IspBundleCountAggregateInputType | true;
    _avg?: IspBundleAvgAggregateInputType;
    _sum?: IspBundleSumAggregateInputType;
    _min?: IspBundleMinAggregateInputType;
    _max?: IspBundleMaxAggregateInputType;
};
export type IspBundleGroupByOutputType = {
    id: number;
    network: string;
    size: string;
    price: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    _count: IspBundleCountAggregateOutputType | null;
    _avg: IspBundleAvgAggregateOutputType | null;
    _sum: IspBundleSumAggregateOutputType | null;
    _min: IspBundleMinAggregateOutputType | null;
    _max: IspBundleMaxAggregateOutputType | null;
};
export type GetIspBundleGroupByPayload<T extends IspBundleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<IspBundleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof IspBundleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], IspBundleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], IspBundleGroupByOutputType[P]>;
}>>;
export type IspBundleWhereInput = {
    AND?: Prisma.IspBundleWhereInput | Prisma.IspBundleWhereInput[];
    OR?: Prisma.IspBundleWhereInput[];
    NOT?: Prisma.IspBundleWhereInput | Prisma.IspBundleWhereInput[];
    id?: Prisma.IntFilter<"IspBundle"> | number;
    network?: Prisma.StringFilter<"IspBundle"> | string;
    size?: Prisma.StringFilter<"IspBundle"> | string;
    price?: Prisma.FloatFilter<"IspBundle"> | number;
    createdAt?: Prisma.DateTimeNullableFilter<"IspBundle"> | Date | string | null;
    updatedAt?: Prisma.DateTimeNullableFilter<"IspBundle"> | Date | string | null;
};
export type IspBundleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    network?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type IspBundleWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.IspBundleWhereInput | Prisma.IspBundleWhereInput[];
    OR?: Prisma.IspBundleWhereInput[];
    NOT?: Prisma.IspBundleWhereInput | Prisma.IspBundleWhereInput[];
    network?: Prisma.StringFilter<"IspBundle"> | string;
    size?: Prisma.StringFilter<"IspBundle"> | string;
    price?: Prisma.FloatFilter<"IspBundle"> | number;
    createdAt?: Prisma.DateTimeNullableFilter<"IspBundle"> | Date | string | null;
    updatedAt?: Prisma.DateTimeNullableFilter<"IspBundle"> | Date | string | null;
}, "id">;
export type IspBundleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    network?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.IspBundleCountOrderByAggregateInput;
    _avg?: Prisma.IspBundleAvgOrderByAggregateInput;
    _max?: Prisma.IspBundleMaxOrderByAggregateInput;
    _min?: Prisma.IspBundleMinOrderByAggregateInput;
    _sum?: Prisma.IspBundleSumOrderByAggregateInput;
};
export type IspBundleScalarWhereWithAggregatesInput = {
    AND?: Prisma.IspBundleScalarWhereWithAggregatesInput | Prisma.IspBundleScalarWhereWithAggregatesInput[];
    OR?: Prisma.IspBundleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.IspBundleScalarWhereWithAggregatesInput | Prisma.IspBundleScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"IspBundle"> | number;
    network?: Prisma.StringWithAggregatesFilter<"IspBundle"> | string;
    size?: Prisma.StringWithAggregatesFilter<"IspBundle"> | string;
    price?: Prisma.FloatWithAggregatesFilter<"IspBundle"> | number;
    createdAt?: Prisma.DateTimeNullableWithAggregatesFilter<"IspBundle"> | Date | string | null;
    updatedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"IspBundle"> | Date | string | null;
};
export type IspBundleCreateInput = {
    network: string;
    size: string;
    price: number;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
};
export type IspBundleUncheckedCreateInput = {
    id?: number;
    network: string;
    size: string;
    price: number;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
};
export type IspBundleUpdateInput = {
    network?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updatedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type IspBundleUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    network?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updatedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type IspBundleCreateManyInput = {
    id?: number;
    network: string;
    size: string;
    price: number;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
};
export type IspBundleUpdateManyMutationInput = {
    network?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updatedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type IspBundleUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    network?: Prisma.StringFieldUpdateOperationsInput | string;
    size?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    createdAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    updatedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type IspBundleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    network?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IspBundleAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type IspBundleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    network?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IspBundleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    network?: Prisma.SortOrder;
    size?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type IspBundleSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type IspBundleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    network?: boolean;
    size?: boolean;
    price?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ispBundle"]>;
export type IspBundleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    network?: boolean;
    size?: boolean;
    price?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ispBundle"]>;
export type IspBundleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    network?: boolean;
    size?: boolean;
    price?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["ispBundle"]>;
export type IspBundleSelectScalar = {
    id?: boolean;
    network?: boolean;
    size?: boolean;
    price?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type IspBundleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "network" | "size" | "price" | "createdAt" | "updatedAt", ExtArgs["result"]["ispBundle"]>;
export type $IspBundlePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "IspBundle";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        network: string;
        size: string;
        price: number;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, ExtArgs["result"]["ispBundle"]>;
    composites: {};
};
export type IspBundleGetPayload<S extends boolean | null | undefined | IspBundleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$IspBundlePayload, S>;
export type IspBundleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<IspBundleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: IspBundleCountAggregateInputType | true;
};
export interface IspBundleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['IspBundle'];
        meta: {
            name: 'IspBundle';
        };
    };
    /**
     * Find zero or one IspBundle that matches the filter.
     * @param {IspBundleFindUniqueArgs} args - Arguments to find a IspBundle
     * @example
     * // Get one IspBundle
     * const ispBundle = await prisma.ispBundle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IspBundleFindUniqueArgs>(args: Prisma.SelectSubset<T, IspBundleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__IspBundleClient<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one IspBundle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IspBundleFindUniqueOrThrowArgs} args - Arguments to find a IspBundle
     * @example
     * // Get one IspBundle
     * const ispBundle = await prisma.ispBundle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IspBundleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, IspBundleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__IspBundleClient<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first IspBundle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IspBundleFindFirstArgs} args - Arguments to find a IspBundle
     * @example
     * // Get one IspBundle
     * const ispBundle = await prisma.ispBundle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IspBundleFindFirstArgs>(args?: Prisma.SelectSubset<T, IspBundleFindFirstArgs<ExtArgs>>): Prisma.Prisma__IspBundleClient<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first IspBundle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IspBundleFindFirstOrThrowArgs} args - Arguments to find a IspBundle
     * @example
     * // Get one IspBundle
     * const ispBundle = await prisma.ispBundle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IspBundleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, IspBundleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__IspBundleClient<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more IspBundles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IspBundleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IspBundles
     * const ispBundles = await prisma.ispBundle.findMany()
     *
     * // Get first 10 IspBundles
     * const ispBundles = await prisma.ispBundle.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const ispBundleWithIdOnly = await prisma.ispBundle.findMany({ select: { id: true } })
     *
     */
    findMany<T extends IspBundleFindManyArgs>(args?: Prisma.SelectSubset<T, IspBundleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a IspBundle.
     * @param {IspBundleCreateArgs} args - Arguments to create a IspBundle.
     * @example
     * // Create one IspBundle
     * const IspBundle = await prisma.ispBundle.create({
     *   data: {
     *     // ... data to create a IspBundle
     *   }
     * })
     *
     */
    create<T extends IspBundleCreateArgs>(args: Prisma.SelectSubset<T, IspBundleCreateArgs<ExtArgs>>): Prisma.Prisma__IspBundleClient<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many IspBundles.
     * @param {IspBundleCreateManyArgs} args - Arguments to create many IspBundles.
     * @example
     * // Create many IspBundles
     * const ispBundle = await prisma.ispBundle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends IspBundleCreateManyArgs>(args?: Prisma.SelectSubset<T, IspBundleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many IspBundles and returns the data saved in the database.
     * @param {IspBundleCreateManyAndReturnArgs} args - Arguments to create many IspBundles.
     * @example
     * // Create many IspBundles
     * const ispBundle = await prisma.ispBundle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many IspBundles and only return the `id`
     * const ispBundleWithIdOnly = await prisma.ispBundle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends IspBundleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, IspBundleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a IspBundle.
     * @param {IspBundleDeleteArgs} args - Arguments to delete one IspBundle.
     * @example
     * // Delete one IspBundle
     * const IspBundle = await prisma.ispBundle.delete({
     *   where: {
     *     // ... filter to delete one IspBundle
     *   }
     * })
     *
     */
    delete<T extends IspBundleDeleteArgs>(args: Prisma.SelectSubset<T, IspBundleDeleteArgs<ExtArgs>>): Prisma.Prisma__IspBundleClient<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one IspBundle.
     * @param {IspBundleUpdateArgs} args - Arguments to update one IspBundle.
     * @example
     * // Update one IspBundle
     * const ispBundle = await prisma.ispBundle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends IspBundleUpdateArgs>(args: Prisma.SelectSubset<T, IspBundleUpdateArgs<ExtArgs>>): Prisma.Prisma__IspBundleClient<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more IspBundles.
     * @param {IspBundleDeleteManyArgs} args - Arguments to filter IspBundles to delete.
     * @example
     * // Delete a few IspBundles
     * const { count } = await prisma.ispBundle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends IspBundleDeleteManyArgs>(args?: Prisma.SelectSubset<T, IspBundleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more IspBundles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IspBundleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IspBundles
     * const ispBundle = await prisma.ispBundle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends IspBundleUpdateManyArgs>(args: Prisma.SelectSubset<T, IspBundleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more IspBundles and returns the data updated in the database.
     * @param {IspBundleUpdateManyAndReturnArgs} args - Arguments to update many IspBundles.
     * @example
     * // Update many IspBundles
     * const ispBundle = await prisma.ispBundle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more IspBundles and only return the `id`
     * const ispBundleWithIdOnly = await prisma.ispBundle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends IspBundleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, IspBundleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one IspBundle.
     * @param {IspBundleUpsertArgs} args - Arguments to update or create a IspBundle.
     * @example
     * // Update or create a IspBundle
     * const ispBundle = await prisma.ispBundle.upsert({
     *   create: {
     *     // ... data to create a IspBundle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IspBundle we want to update
     *   }
     * })
     */
    upsert<T extends IspBundleUpsertArgs>(args: Prisma.SelectSubset<T, IspBundleUpsertArgs<ExtArgs>>): Prisma.Prisma__IspBundleClient<runtime.Types.Result.GetResult<Prisma.$IspBundlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of IspBundles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IspBundleCountArgs} args - Arguments to filter IspBundles to count.
     * @example
     * // Count the number of IspBundles
     * const count = await prisma.ispBundle.count({
     *   where: {
     *     // ... the filter for the IspBundles we want to count
     *   }
     * })
    **/
    count<T extends IspBundleCountArgs>(args?: Prisma.Subset<T, IspBundleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], IspBundleCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a IspBundle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IspBundleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IspBundleAggregateArgs>(args: Prisma.Subset<T, IspBundleAggregateArgs>): Prisma.PrismaPromise<GetIspBundleAggregateType<T>>;
    /**
     * Group by IspBundle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IspBundleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends IspBundleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: IspBundleGroupByArgs['orderBy'];
    } : {
        orderBy?: IspBundleGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, IspBundleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIspBundleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the IspBundle model
     */
    readonly fields: IspBundleFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for IspBundle.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__IspBundleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the IspBundle model
 */
export interface IspBundleFieldRefs {
    readonly id: Prisma.FieldRef<"IspBundle", 'Int'>;
    readonly network: Prisma.FieldRef<"IspBundle", 'String'>;
    readonly size: Prisma.FieldRef<"IspBundle", 'String'>;
    readonly price: Prisma.FieldRef<"IspBundle", 'Float'>;
    readonly createdAt: Prisma.FieldRef<"IspBundle", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"IspBundle", 'DateTime'>;
}
/**
 * IspBundle findUnique
 */
export type IspBundleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * Filter, which IspBundle to fetch.
     */
    where: Prisma.IspBundleWhereUniqueInput;
};
/**
 * IspBundle findUniqueOrThrow
 */
export type IspBundleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * Filter, which IspBundle to fetch.
     */
    where: Prisma.IspBundleWhereUniqueInput;
};
/**
 * IspBundle findFirst
 */
export type IspBundleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * Filter, which IspBundle to fetch.
     */
    where?: Prisma.IspBundleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IspBundles to fetch.
     */
    orderBy?: Prisma.IspBundleOrderByWithRelationInput | Prisma.IspBundleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IspBundles.
     */
    cursor?: Prisma.IspBundleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IspBundles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IspBundles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IspBundles.
     */
    distinct?: Prisma.IspBundleScalarFieldEnum | Prisma.IspBundleScalarFieldEnum[];
};
/**
 * IspBundle findFirstOrThrow
 */
export type IspBundleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * Filter, which IspBundle to fetch.
     */
    where?: Prisma.IspBundleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IspBundles to fetch.
     */
    orderBy?: Prisma.IspBundleOrderByWithRelationInput | Prisma.IspBundleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for IspBundles.
     */
    cursor?: Prisma.IspBundleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IspBundles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IspBundles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IspBundles.
     */
    distinct?: Prisma.IspBundleScalarFieldEnum | Prisma.IspBundleScalarFieldEnum[];
};
/**
 * IspBundle findMany
 */
export type IspBundleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * Filter, which IspBundles to fetch.
     */
    where?: Prisma.IspBundleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of IspBundles to fetch.
     */
    orderBy?: Prisma.IspBundleOrderByWithRelationInput | Prisma.IspBundleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing IspBundles.
     */
    cursor?: Prisma.IspBundleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` IspBundles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` IspBundles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of IspBundles.
     */
    distinct?: Prisma.IspBundleScalarFieldEnum | Prisma.IspBundleScalarFieldEnum[];
};
/**
 * IspBundle create
 */
export type IspBundleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * The data needed to create a IspBundle.
     */
    data: Prisma.XOR<Prisma.IspBundleCreateInput, Prisma.IspBundleUncheckedCreateInput>;
};
/**
 * IspBundle createMany
 */
export type IspBundleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many IspBundles.
     */
    data: Prisma.IspBundleCreateManyInput | Prisma.IspBundleCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * IspBundle createManyAndReturn
 */
export type IspBundleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * The data used to create many IspBundles.
     */
    data: Prisma.IspBundleCreateManyInput | Prisma.IspBundleCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * IspBundle update
 */
export type IspBundleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * The data needed to update a IspBundle.
     */
    data: Prisma.XOR<Prisma.IspBundleUpdateInput, Prisma.IspBundleUncheckedUpdateInput>;
    /**
     * Choose, which IspBundle to update.
     */
    where: Prisma.IspBundleWhereUniqueInput;
};
/**
 * IspBundle updateMany
 */
export type IspBundleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update IspBundles.
     */
    data: Prisma.XOR<Prisma.IspBundleUpdateManyMutationInput, Prisma.IspBundleUncheckedUpdateManyInput>;
    /**
     * Filter which IspBundles to update
     */
    where?: Prisma.IspBundleWhereInput;
    /**
     * Limit how many IspBundles to update.
     */
    limit?: number;
};
/**
 * IspBundle updateManyAndReturn
 */
export type IspBundleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * The data used to update IspBundles.
     */
    data: Prisma.XOR<Prisma.IspBundleUpdateManyMutationInput, Prisma.IspBundleUncheckedUpdateManyInput>;
    /**
     * Filter which IspBundles to update
     */
    where?: Prisma.IspBundleWhereInput;
    /**
     * Limit how many IspBundles to update.
     */
    limit?: number;
};
/**
 * IspBundle upsert
 */
export type IspBundleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * The filter to search for the IspBundle to update in case it exists.
     */
    where: Prisma.IspBundleWhereUniqueInput;
    /**
     * In case the IspBundle found by the `where` argument doesn't exist, create a new IspBundle with this data.
     */
    create: Prisma.XOR<Prisma.IspBundleCreateInput, Prisma.IspBundleUncheckedCreateInput>;
    /**
     * In case the IspBundle was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.IspBundleUpdateInput, Prisma.IspBundleUncheckedUpdateInput>;
};
/**
 * IspBundle delete
 */
export type IspBundleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
    /**
     * Filter which IspBundle to delete.
     */
    where: Prisma.IspBundleWhereUniqueInput;
};
/**
 * IspBundle deleteMany
 */
export type IspBundleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which IspBundles to delete
     */
    where?: Prisma.IspBundleWhereInput;
    /**
     * Limit how many IspBundles to delete.
     */
    limit?: number;
};
/**
 * IspBundle without action
 */
export type IspBundleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IspBundle
     */
    select?: Prisma.IspBundleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the IspBundle
     */
    omit?: Prisma.IspBundleOmit<ExtArgs> | null;
};
//# sourceMappingURL=IspBundle.d.ts.map